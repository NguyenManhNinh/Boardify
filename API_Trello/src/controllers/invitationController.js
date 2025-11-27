import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'

// Send board invitation
const sendInvitation = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const { email } = req.body
    const inviterId = req.jwtDecoded.id  // JWT uses 'id' not '_id'

    const result = await invitationService.createInvitation(boardId, inviterId, email)

    res.status(StatusCodes.OK).json({
      message: `Đã gửi lời mời đến ${result.email}`,
      invitation: {
        email: result.email,
        boardName: result.boardName,
        expiresAt: result.expiresAt
      }
    })
  } catch (error) {
    next(error)
  }
}

// Accept board invitation
const acceptInvitation = async (req, res, next) => {
  try {
    const { token } = req.body
    const userId = req.jwtDecoded.id  // JWT uses 'id' not '_id'
    const userEmail = req.jwtDecoded.email

    const result = await invitationService.acceptInvitation(token, userId, userEmail)

    res.status(StatusCodes.OK).json({
      message: `Bạn đã tham gia board "${result.boardTitle}" thành công`,
      boardId: result.boardId
    })
  } catch (error) {
    next(error)
  }
}

// Get board invitations (optional - for listing pending invites)
const getBoardInvitations = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.jwtDecoded.id  // JWT uses 'id' not '_id'

    const invitations = await invitationService.getBoardInvitations(boardId, userId)

    res.status(StatusCodes.OK).json({
      invitations
    })
  } catch (error) {
    next(error)
  }
}

export const invitationController = {
  sendInvitation,
  acceptInvitation,
  getBoardInvitations
}
