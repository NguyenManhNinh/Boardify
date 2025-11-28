import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import ApiError from '~/utils/ApiError'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import jwt from 'jsonwebtoken'

const register = async (req, res, next) => {
  try {
    const createdUser = await authService.register(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const loginResult = await authService.login(req.body)
    res.status(StatusCodes.OK).json(loginResult)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.jwtDecoded.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const result = await authService.getProfile(req.jwtDecoded.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const result = await authService.updateProfile(req.jwtDecoded.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const result = await authService.updateAvatar(req.jwtDecoded.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getAvatarFile = async (req, res, next) => {
  try {
    const { fileId } = req.params

    if (!fileId || !ObjectId.isValid(fileId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid file ID')
    }

    const db = GET_DB()
    const bucket = new (require('mongodb')).GridFSBucket(db, {
      bucketName: 'avatar'
    })

    // Check if file exists
    const files = await db.collection('avatar.files').find({ _id: new ObjectId(fileId) }).toArray()

    if (!files.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Avatar file not found')
    }

    const file = files[0]

    // Set response headers
    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Disposition': 'inline'
    })

    // Stream the file
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))
    downloadStream.pipe(res)

  } catch (error) {
    next(error)
  }
}

const googleLogin = (req, res, next) => {
  try {
    let userId = null
    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET)
        userId = decoded.id
      } catch (error) {
        // Token invalid or expired, proceed as login (userId = null)
      }
    }

    const result = authService.googleLogin(userId)
    // Return URL for frontend to redirect
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const googleCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query
    const result = await authService.googleCallback(code, state)

    const frontendUrl = env.FRONTEND_URL || 'http://localhost:5173'

    if (result.type === 'login') {
      const token = result.data.token
      return res.redirect(`${frontendUrl}/auth/callback?token=${token}`)
    }

    if (result.type === 'connect') {
      return res.redirect(`${frontendUrl}/boards?google_drive=connected`)
    }

    res.redirect(`${frontendUrl}/boards?google_drive=connected`)
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:5173'
    res.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent(error.message)}`)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body.token, req.body.password)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const authController = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  updateAvatar,
  getAvatarFile,
  googleLogin,
  googleCallback,
  forgotPassword,
  resetPassword
}
