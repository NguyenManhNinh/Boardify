import { slugify } from "~/utils/formatters"
import { boardModel } from "~/models/boardModel"
import { columnModel } from "~/models/columnModel"
import { cardModel } from "~/models/cardModel"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"
import { cloneDeep } from "lodash"
import { google } from 'googleapis'
import { userModel } from "~/models/userModel"
import { env } from "~/config/environment"

const createNew = async (reqBody, userId) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
      ownerIds: [userId],
      memberIds: [userId]
    }
    console.log('DEBUG: boardService createNew - newBoard:', JSON.stringify(newBoard, null, 2))
    const createBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getAllBoards = async (userId) => {
  try {
    const boards = await boardModel.findByUserId(userId)
    return boards
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      // column.cards=resBoard.cards.filter(card=>card.columnId.toString()===column._id.toString())
    })
    //Xoas mang card khoi buoc ban dau
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}
const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}
const moveCardToDifferentColumn = async (reqBody) => {
  try {
    //B1:Cập nhật mảng cardOrderIds của column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    //B2:Cập nhật mảng cardOrderIds của column tiếp theo(Hiểu bản chất là thêm _id của card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    //B3:Cập nhật lại trường columnId mới của cái card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()

    })
    return { updateResult: 'successfully' }
  } catch (error) {
    throw error
  }
}

const deleteBoard = async (boardId, userId) => {
  try {
    // Verify board exists and user has permission
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Check if user is owner
    if (!board.ownerIds.map(id => id.toString()).includes(userId.toString())) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to delete this board')
    }

    // Delete all cards in this board
    await cardModel.deleteManyByBoardId(boardId)

    // Delete all columns in this board
    await columnModel.deleteManyByBoardId(boardId)

    // Delete the board itself
    await boardModel.deleteOneById(boardId)

    return { message: 'Board deleted successfully' }
  } catch (error) {
    throw error
  }
}


// ... (previous imports)

const backupToGoogleDrive = async (boardId, userId) => {
  try {
    console.log('🔍 [Backup] Starting backup for board:', boardId, 'user:', userId)

    // 1. Get Board Data
    console.log('🔍 [Backup] Step 1: Fetching board data...')
    const boardData = await getDetails(boardId)
    console.log('✅ [Backup] Board data fetched:', boardData.title)

    // 2. Get User Google Credentials
    console.log('🔍 [Backup] Step 2: Fetching user credentials...')
    const user = await userModel.findOneById(userId)
    console.log('✅ [Backup] User found:', user.email)
    console.log('🔍 [Backup] Has googleProvider:', !!user.googleProvider)
    console.log('🔍 [Backup] Has refreshToken:', !!user.googleProvider?.refreshToken)
    console.log('🔍 [Backup] Has accessToken:', !!user.googleProvider?.accessToken)

    if (!user || !user.googleProvider || !user.googleProvider.refreshToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Google Drive not connected')
    }

    // 3. Setup Google Auth
    console.log('🔍 [Backup] Step 3: Setting up Google OAuth client...')
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    )
    oauth2Client.setCredentials({
      refresh_token: user.googleProvider.refreshToken,
      access_token: user.googleProvider.accessToken
    })
    console.log('✅ [Backup] OAuth client configured')

    // 4. Upload to Drive
    console.log('🔍 [Backup] Step 4: Uploading to Google Drive...')
    const drive = google.drive({ version: 'v3', auth: oauth2Client })
    const fileName = `board-${boardData.slug}-backup-${new Date().toISOString().slice(0, 10)}.json`
    console.log('🔍 [Backup] File name:', fileName)

    const fileMetadata = {
      name: fileName,
      mimeType: 'application/json'
    }
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(boardData, null, 2)
    }

    console.log('🔍 [Backup] Calling drive.files.create...')
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    })

    console.log('✅ [Backup] File uploaded successfully!')
    console.log('✅ [Backup] File ID:', file.data.id)
    console.log('✅ [Backup] File URL:', file.data.webViewLink)

    return {
      success: true,
      fileId: file.data.id,
      fileUrl: file.data.webViewLink
    }
  } catch (error) {
    console.error('❌ [Backup] Error occurred!')
    console.error('❌ [Backup] Error message:', error.message)
    console.error('❌ [Backup] Error code:', error.code)
    console.error('❌ [Backup] Full error:', error)
    throw error
  }
}

const getBoardMembers = async (boardId) => {
  try {
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Get user details for all members
    const { GET_DB } = await import('~/config/mongodb')
    const { userModel } = await import('~/models/userModel')
    const { ObjectId } = await import('mongodb')

    const db = GET_DB()
    const memberIds = board.memberIds.map(id => new ObjectId(id))

    const members = await db.collection(userModel.USER_COLLECTION_NAME)
      .find({ _id: { $in: memberIds } })
      .project({ password: 0 })  // Exclude password
      .toArray()

    // Add role information (owner or member)
    const membersWithRoles = members.map(member => ({
      ...member,
      role: board.ownerIds.includes(member._id.toString()) ? 'owner' : 'member'
    }))

    return membersWithRoles
  } catch (error) {
    throw error
  }
}

const addMember = async (boardId, userIdToAdd, currentUserId) => {
  try {
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Check if current user is owner
    if (!board.ownerIds.includes(currentUserId)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Only board owners can add members')
    }

    // Check if user to add exists
    const { userModel } = await import('~/models/userModel')
    const userToAdd = await userModel.findOneById(userIdToAdd)
    if (!userToAdd) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Check if user is already a member
    if (board.memberIds.includes(userIdToAdd)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User is already a member of this board')
    }

    // Add user to memberIds
    const updatedBoard = await boardModel.update(boardId, {
      memberIds: [...board.memberIds, userIdToAdd]
    })

    return {
      message: 'Member added successfully',
      member: {
        _id: userToAdd._id,
        username: userToAdd.username,
        displayName: userToAdd.displayName,
        email: userToAdd.email,
        avatar: userToAdd.avatar,
        role: 'member'
      }
    }
  } catch (error) {
    throw error
  }
}

const removeMember = async (boardId, userIdToRemove, currentUserId) => {
  try {
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Check if current user is owner
    if (!board.ownerIds.includes(currentUserId)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Only board owners can remove members')
    }

    // Cannot remove owner
    if (board.ownerIds.includes(userIdToRemove)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot remove board owner')
    }

    // Check if user is a member
    if (!board.memberIds.includes(userIdToRemove)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a member of this board')
    }

    // Remove user from memberIds
    const updatedMemberIds = board.memberIds.filter(id => id !== userIdToRemove)
    await boardModel.update(boardId, {
      memberIds: updatedMemberIds
    })

    return {
      message: 'Member removed successfully'
    }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getAllBoards,
  getDetails,
  update,
  moveCardToDifferentColumn,
  deleteBoard,
  backupToGoogleDrive,
  getBoardMembers,
  addMember,
  removeMember
}
