import bcryptjs from 'bcryptjs'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const AVATAR_FILES_COLLECTION = 'avatar.files'
const AVATAR_CHUNKS_COLLECTION = 'avatar.chunks'

const getProfile = async (userId) => {
  console.log('🟢 getProfile called with userId:', userId)
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    console.log('🟡 User found, stats before removal:', user.stats)
    // Return user data without password and old stats
    const { password: _, stats: __, ...userWithoutPassword } = user
    console.log('🟡 After destructure, preparing to calculate stats')


    // --- Calculate Stats ---
    const db = GET_DB()

    // Convert userId to string and ObjectId for comparison
    const userIdString = userId.toString()
    const userIdObj = new ObjectId(userId)

    // 1. Boards Created (where user is in ownerIds)
    const boardsCreated = await db.collection('boards').countDocuments({
      ownerIds: { $in: [userIdString, userIdObj] },
      _destroy: false
    })
    console.log('DEBUG: getProfile - userIdString:', userIdString)
    console.log('DEBUG: getProfile - boardsCreated count:', boardsCreated)

    // 2. Tasks Completed (memberIds contains user AND isDone is true)
    const tasksCompleted = await db.collection('cards').countDocuments({
      memberIds: { $in: [userIdString, userIdObj] },
      isDone: true,
      _destroy: false
    })

    // 3. Total Lists (count columns in boards where user is member)
    // First get all board IDs where user is member
    const userBoards = await db.collection('boards').find(
      {
        memberIds: { $in: [userIdString, userIdObj] },
        _destroy: false
      },
      { projection: { _id: 1 } }
    ).toArray()
    const userBoardIds = userBoards.map(b => b._id)

    const totalLists = await db.collection('columns').countDocuments({
      boardId: { $in: userBoardIds },
      _destroy: false
    })

    // 4. Active Boards (memberIds contains user AND updatedAt >= 7 days ago)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    const activeBoards = await db.collection('boards').countDocuments({
      memberIds: { $in: [userIdString, userIdObj] },
      updatedAt: { $gte: sevenDaysAgo },
      _destroy: false
    })


    return {
      data: {
        ...userWithoutPassword,
        stats: {
          boardsCreated,
          tasksCompleted,
          totalLists,
          activeBoards
        }
      },
      message: 'Get profile successfully'
    }
  } catch (error) {
    throw error
  }
}

const getRecentActivities = async (userId) => {
  try {
    const db = GET_DB()
    const activities = []

    // Helper to generate consistent activity ID
    const generateActivityId = (action, targetId, timestamp) => {
      return `${action}_${targetId}_${timestamp}`
    }

    // Get hidden activities for this user
    const hiddenActivities = await db.collection('hidden_activities')
      .find({ userId })
      .toArray()
    const hiddenIds = new Set(hiddenActivities.map(h => h.activityId))

    // 1. Recent boards created
    const recentBoards = await db.collection('boards')
      .find({ ownerIds: userId, _destroy: false })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    recentBoards.forEach(board => {
      const activityId = generateActivityId('create_board', board._id.toString(), board.createdAt)
      if (!hiddenIds.has(activityId)) {
        activities.push({
          id: activityId,
          action: 'create_board',
          targetTitle: '',
          boardTitle: board.title,
          time: board.createdAt
        })
      }
    })

    // 2. Recent cards marked done
    const doneCards = await db.collection('cards')
      .find({ memberIds: userId, isDone: true, _destroy: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray()

    // Get board titles for done cards
    if (doneCards.length > 0) {
      const cardBoardIds = [...new Set(doneCards.map(c => c.boardId))]
      const boards = await db.collection('boards')
        .find({ _id: { $in: cardBoardIds } })
        .toArray()
      const boardMap = Object.fromEntries(boards.map(b => [b._id.toString(), b.title]))

      doneCards.forEach(card => {
        const activityId = generateActivityId('complete_card', card._id.toString(), card.updatedAt || card.createdAt)
        if (!hiddenIds.has(activityId)) {
          activities.push({
            id: activityId,
            action: 'complete_card',
            targetTitle: card.title,
            boardTitle: boardMap[card.boardId.toString()] || 'Unknown Board',
            time: card.updatedAt || card.createdAt
          })
        }
      })
    }

    // 3. Recent cards created
    const recentCards = await db.collection('cards')
      .find({ memberIds: userId, _destroy: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Get board titles for recent cards
    if (recentCards.length > 0) {
      const cardBoardIds = [...new Set(recentCards.map(c => c.boardId))]
      const boards = await db.collection('boards')
        .find({ _id: { $in: cardBoardIds } })
        .toArray()
      const boardMap = Object.fromEntries(boards.map(b => [b._id.toString(), b.title]))

      recentCards.forEach(card => {
        const activityId = generateActivityId('create_card', card._id.toString(), card.createdAt)
        if (!hiddenIds.has(activityId)) {
          activities.push({
            id: activityId,
            action: 'create_card',
            targetTitle: card.title,
            boardTitle: boardMap[card.boardId.toString()] || 'Unknown Board',
            time: card.createdAt
          })
        }
      })
    }

    // 4. Sort by time (most recent first) and limit to 10
    activities.sort((a, b) => b.time - a.time)
    const limitedActivities = activities.slice(0, 10)

    return {
      data: limitedActivities,
      message: 'Get recent activities successfully'
    }
  } catch (error) {
    throw error
  }
}

const hideActivity = async (userId, activityId) => {
  try {
    const db = GET_DB()

    // Check if already hidden
    const existing = await db.collection('hidden_activities').findOne({
      userId,
      activityId
    })

    if (existing) {
      return {
        message: 'Activity already hidden'
      }
    }

    // Insert hidden activity record
    await db.collection('hidden_activities').insertOne({
      userId,
      activityId,
      hiddenAt: Date.now()
    })

    return {
      message: 'Activity hidden successfully'
    }
  } catch (error) {
    throw error
  }
}

const updateBio = async (userId, data) => {
  try {
    const { bio } = data

    if (bio === undefined) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Bio is required')
    }

    // Update bio in database
    const updatedUser = await userModel.update(userId, { bio })

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser

    return {
      data: userWithoutPassword,
      message: 'Bio updated successfully'
    }
  } catch (error) {
    throw error
  }
}

const updateAvatar = async (userId, data) => {
  try {
    const { avatarUrl } = data

    if (!avatarUrl) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Avatar URL is required')
    }

    // Check if the avatar is too large for MongoDB document (16MB limit)
    // Base64 data is ~33% larger, so ~12MB raw = ~16MB base64 limit
    const isLargeFile = avatarUrl.length > 16 * 1024 * 1024

    if (isLargeFile) {
      console.log('Avatar file is large, storing in GridFS:', avatarUrl.length)
      // For large files, store in GridFS
      const db = GET_DB()

      // Remove any existing avatar file for this user
      const existingFile = await db.collection(AVATAR_FILES_COLLECTION).findOne({ 'metadata.userId': userId })
      if (existingFile) {
        await db.collection(AVATAR_FILES_COLLECTION).deleteOne({ _id: existingFile._id })
      }

      // Store new file in GridFS
      const buffer = Buffer.from(avatarUrl.split(',')[1] || avatarUrl, 'base64')

      const bucket = new (require('mongodb')).GridFSBucket(db, {
        bucketName: 'avatar'
      })

      const uploadStream = bucket.openUploadStream(`avatar_${userId}_${Date.now()}.glb`, {
        metadata: { userId, originalSize: avatarUrl.length }
      })

      uploadStream.end(buffer)

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve)
        uploadStream.on('error', reject)
      })

      const fileId = uploadStream.id

      // Store GridFS file reference in user document
      const updatedUser = await userModel.update(userId, { avatar: fileId.toString(), avatarType: 'gridfs' })

      // Return updated user or fetch fresh data
      let userToReturn = updatedUser
      if (!updatedUser) {
        userToReturn = await userModel.findOneById(userId)
      }

      if (!userToReturn) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update avatar')
      }

      const { password: _, ...userWithoutPassword } = userToReturn

      return {
        data: userWithoutPassword,
        message: 'Large avatar uploaded successfully to GridFS'
      }
    } else {
      // For small files, store directly in document
      console.log('Avatar file is small, storing directly:', avatarUrl.length)
      const updatedUser = await userModel.update(userId, { avatar: avatarUrl, avatarType: 'inline' })

      // Return updated user or fetch fresh data
      let userToReturn = updatedUser
      if (!updatedUser) {
        userToReturn = await userModel.findOneById(userId)
      }

      if (!userToReturn) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update avatar')
      }

      const { password: _, ...userWithoutPassword } = userToReturn

      return {
        data: userWithoutPassword,
        message: 'Avatar updated successfully'
      }
    }
  } catch (error) {
    throw error
  }
}

const updateSettings = async (userId, data) => {
  try {
    const { displayName, phone, bio } = data

    const updateData = {}
    if (displayName) updateData.displayName = displayName
    if (phone) updateData.phone = phone
    if (bio) updateData.bio = bio

    const updatedUser = await userModel.update(userId, updateData)

    console.log('Updated user result:', updatedUser)

    // Return updated user or fetch fresh data
    let userToReturn = updatedUser
    if (!updatedUser) {
      userToReturn = await userModel.findOneById(userId)
    }

    if (!userToReturn) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update settings')
    }

    const { password: _, ...userWithoutPassword } = userToReturn

    return {
      data: userWithoutPassword,
      message: 'Settings updated successfully'
    }
  } catch (error) {
    throw error
  }
}

const changePassword = async (userId, data) => {
  try {
    const { oldPassword, newPassword } = data

    if (!oldPassword || !newPassword) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Old password and new password are required')
    }

    if (newPassword.length < 6) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'New password must be at least 6 characters')
    }

    // Lấy user hiện tại
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Kiểm tra old password
    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password)
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Old password is incorrect')
    }

    // Hash password mới
    const hashedPassword = await bcryptjs.hash(newPassword, 10)

    // Update password
    const updatedUser = await userModel.update(userId, { password: hashedPassword })

    console.log('Updated user result:', updatedUser)

    if (!updatedUser) {
      console.log('updatedUser is null or undefined, but password was still changed')
      // Password was updated successfully even if updatedUser is null
      return {
        message: 'Password changed successfully'
      }
    }

    return {
      message: 'Password changed successfully'
    }
  } catch (error) {
    throw error
  }
}

const getUsers = async (searchQuery) => {
  try {
    if (!searchQuery) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Search query is required')
    }

    const db = GET_DB()

    // Search by email or displayName or username (case-insensitive)
    const users = await db.collection(userModel.USER_COLLECTION_NAME).find({
      $or: [
        { email: { $regex: searchQuery, $options: 'i' } },
        { displayName: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } }
      ],
      _destroy: false
    }).limit(10).toArray()

    // Remove password from results
    const usersWithoutPassword = users.map(user => {
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return {
      data: usersWithoutPassword,
      message: 'Search users successfully'
    }
  } catch (error) {
    throw error
  }
}

export const userService = {
  getProfile,
  getRecentActivities,
  hideActivity,
  updateBio,
  updateAvatar,
  updateSettings,
  changePassword,
  getUsers
}
