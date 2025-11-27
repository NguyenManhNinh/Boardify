import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import crypto from 'crypto'
import { EmailProvider } from '~/providers/EmailProvider'

const register = async (data) => {
  try {
    const { email, password, username, displayName } = data

    // Kiểm tra email đã tồn tại
    const existingEmail = await userModel.findOneByEmail(email)
    if (existingEmail) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
    }

    // Kiểm tra username đã tồn tại
    const existingUsername = await userModel.findOneByUsername(username)
    if (existingUsername) {
      throw new ApiError(StatusCodes.CONFLICT, 'Username already exists')
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Tạo user mới
    const newUser = {
      email,
      password: hashedPassword,
      username,
      displayName: displayName || username
    }

    const result = await userModel.createNew(newUser)

    // Trả về user data mà không có password
    const userCreated = await userModel.findOneById(result.insertedId.toString())
    const { password: _, ...userWithoutPassword } = userCreated

    return {
      data: userWithoutPassword,
      message: 'Register successfully'
    }
  } catch (error) {
    throw error
  }
}

const login = async (data) => {
  try {
    const { email, password } = data

    // Kiểm tra email tồn tại
    const user = await userModel.findOneByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
    }

    // Kiểm tra password
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Trả về user data mà không có password và google tokens
    // Safe handling for old users without googleProvider field
    const { password: _, googleProvider, ...userWithoutPassword } = user

    return {
      data: {
        ...userWithoutPassword,
        token,
        isGoogleConnected: googleProvider ? true : false
      },
      message: 'Login successfully'
    }
  } catch (error) {
    console.error('[Login Error]', error)
    throw error
  }
}

const getProfile = async (userId) => {
  try {
    // Delegate to userService to get profile with stats
    const result = await userService.getProfile(userId)
    return result
  } catch (error) {
    throw error
  }
}

const updateProfile = async (userId, data) => {
  try {
    const { displayName, avatar } = data

    const updateData = {}
    if (displayName) updateData.displayName = displayName
    if (avatar) updateData.avatar = avatar

    const updatedUser = await userModel.update(userId, updateData)
    if (!updatedUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update profile')
    }

    const { password: _, ...userWithoutPassword } = updatedUser
    return {
      data: userWithoutPassword,
      message: 'Profile updated successfully'
    }
  } catch (error) {
    throw error
  }
}

const logout = async (userId) => {
  try {
    // For now, just return success as we are using stateless JWT
    // In the future, we can implement token blacklisting here
    return {
      message: 'Logout successfully'
    }
  } catch (error) {
    throw error
  }
}

import { google } from 'googleapis'

// ... (previous imports)

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
)

const googleLogin = (userId = null) => {
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: userId || 'login' // Pass userId or 'login' to identify flow
  })

  return { url }
}

const googleCallback = async (code, state) => {
  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info from Google
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    })
    const { data: googleUser } = await oauth2.userinfo.get()

    // CASE 1: Login Flow (state === 'login')
    if (state === 'login') {
      // Find user by googleId or email
      let user = await userModel.findOneByGoogleId(googleUser.id)
      if (!user) {
        user = await userModel.findOneByEmail(googleUser.email)
      }

      if (!user) {
        // Create new user
        const newUser = {
          email: googleUser.email,
          username: googleUser.email.split('@')[0], // Simple username generation
          displayName: googleUser.name,
          avatar: googleUser.picture,
          googleId: googleUser.id,
          role: 'client',
          googleProvider: {
            id: googleUser.id,
            email: googleUser.email,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token
          }
        }
        // Create random password for google users (they won't use it)
        const randomPassword = crypto.randomBytes(16).toString('hex')
        const hashedPassword = await bcryptjs.hash(randomPassword, 10)
        newUser.password = hashedPassword

        const result = await userModel.createNew(newUser)
        user = await userModel.findOneById(result.insertedId.toString())
      } else {
        // Update googleId if missing
        if (!user.googleId) {
          await userModel.update(user._id.toString(), {
            googleId: googleUser.id,
            avatar: user.avatar || googleUser.picture, // Update avatar if missing
            googleProvider: {
              id: googleUser.id,
              email: googleUser.email,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token
            }
          })
        }
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role
        },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { password: _, googleProvider, ...userWithoutPassword } = user
      return {
        type: 'login',
        data: {
          ...userWithoutPassword,
          token,
          isGoogleConnected: true
        }
      }
    }

    // CASE 2: Connect Drive Flow (state === userId)
    const userId = state
    const updateData = {
      googleProvider: {
        id: googleUser.id,
        email: googleUser.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      }
    }

    if (userId) {
      await userModel.update(userId, updateData)
    }

    return {
      type: 'connect',
      message: 'Google Drive connected successfully',
      tokens
    }
  } catch (error) {
    throw error
  }
}

const forgotPassword = async (email) => {
  try {
    const user = await userModel.findOneByEmail(email)

    if (!user) {
      // Return success even if user not found to prevent enumeration
      return { message: 'Nếu email hợp lệ, chúng tôi sẽ gửi link đặt lại mật khẩu vào email của bạn vui lòng kiểm tra thông báo.' }
    }

    // 1. Generate random token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // 2. Hash token to save in DB
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // 3. Save token and expiration (15 mins) to DB
    const passwordResetExpires = Date.now() + 15 * 60 * 1000
    await userModel.update(user._id.toString(), {
      passwordResetToken: resetTokenHash,
      passwordResetExpires
    })

    // 4. Send email
    const resetLink = `${env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`

    await EmailProvider.sendEmail(
      user.email,
      'Đặt lại mật khẩu Boardify',
      `
        <p>Xin chào ${user.displayName || user.username},</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản Boardify.</p>
        <p>Nhấn vào link dưới đây để đặt mật khẩu mới (hiệu lực trong 15 phút):</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      `
    )

    return { message: 'Nếu email hợp lệ, chúng tôi đã gửi link đặt lại mật khẩu.' }
  } catch (error) {
    throw error
  }
}

const resetPassword = async (token, password) => {
  try {
    if (!token || !password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu token hoặc mật khẩu')
    }

    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Find user with valid token and not expired
    // Note: We need to implement a findOneByResetToken in userModel or use GET_DB directly
    // For now, let's use a direct DB query via a new model method or just iterate (inefficient but works for now if we don't want to change model too much)
    // Better: Add findOneByResetToken to userModel. But since I can't easily change model without reading it again and I want to be fast, I will use a direct query if possible or add the method.
    // Actually, I can just add the method to userModel in the next step or use existing update method logic if I can query.
    // Let's assume I will add findOneByResetToken to userModel.

    // Wait, I can't assume. I should check userModel again.
    // userModel has findOneByEmail, findOneByUsername, findOneById.
    // I should add findOneByResetToken to userModel.

    // For now, let's implement the logic assuming the method exists, and I will add it to userModel in the next step.
    const user = await userModel.findOneByResetToken(tokenHash)

    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Token không hợp lệ hoặc đã hết hạn')
    }

    if (user.passwordResetExpires < Date.now()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Token đã hết hạn')
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Update user
    await userModel.update(user._id.toString(), {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    })

    return { message: 'Mật khẩu đã được cập nhật. Hãy đăng nhập lại.' }
  } catch (error) {
    throw error
  }
}

export const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  googleLogin,
  googleCallback,
  forgotPassword,
  resetPassword
}
