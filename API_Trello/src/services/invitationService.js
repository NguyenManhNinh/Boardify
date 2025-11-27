import { invitationModel } from '~/models/invitationModel'
import { boardModel } from '~/models/boardModel'
import { userModel } from '~/models/userModel'
import { emailService } from '~/services/emailService'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Create and send board invitation
const createInvitation = async (boardId, inviterId, inviteeEmail) => {
  try {
    // 1. Validate board existence
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board không tồn tại')
    }

    // 2. Check if inviter has permission (must be owner or admin)
    // Safe check: ensure ownerIds exists and is an array
    const ownerIds = board.ownerIds || []
    const isOwner = ownerIds.some(ownerId => ownerId && ownerId.toString() === inviterId.toString())

    if (!isOwner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền mời thành viên vào board này')
    }

    // 3. Get inviter information
    const inviter = await userModel.findOneById(inviterId)
    if (!inviter) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Người mời không tồn tại')
    }

    // 4. Validate invitee email
    const normalizedEmail = inviteeEmail.toLowerCase().trim()

    // Don't allow inviting yourself
    if (inviter.email.toLowerCase() === normalizedEmail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Bạn không thể mời chính mình')
    }

    // Check if email is already a member
    const existingMember = await userModel.findOneByEmail(normalizedEmail)
    if (existingMember) {
      const memberIds = board.memberIds || []
      const isMember = memberIds.some(
        memberId => memberId && memberId.toString() === existingMember._id.toString()
      )
      const isOwnerMember = ownerIds.some(
        ownerId => ownerId && ownerId.toString() === existingMember._id.toString()
      )

      if (isMember || isOwnerMember) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email này đã là thành viên của board')
      }
    }

    // 5. Check for existing pending invitation
    const existingInvitation = await invitationModel.findPendingByBoardAndEmail(boardId, normalizedEmail)
    if (existingInvitation) {
      throw new ApiError(StatusCodes.CONFLICT, 'Đã có lời mời đang chờ xử lý cho email này')
    }

    // 6. Generate secure token and calculate expiry
    const token = invitationModel.generateToken()
    const expiryDays = env.INVITATION_TOKEN_EXPIRY_DAYS
    const expiredAt = Date.now() + (expiryDays * 24 * 60 * 60 * 1000)

    // 7. Create invitation document
    const invitationData = {
      boardId: boardId,
      inviterId: inviterId,
      inviteeEmail: normalizedEmail,
      token: token,
      status: invitationModel.INVITATION_STATUS.PENDING,
      expiredAt: expiredAt
    }

    const result = await invitationModel.createNew(invitationData)

    // 8. Send invitation email
    const inviteLink = `${env.FRONTEND_URL}/invite/accept?token=${token}`
    const inviterName = inviter.displayName || inviter.username || inviter.email

    try {
      await emailService.sendBoardInvitationEmail({
        to: normalizedEmail,
        inviterName: inviterName,
        boardName: board.title,
        inviteLink: inviteLink,
        expiryDays: expiryDays
      })
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError)
      // Don't fail the whole operation if email fails
      // The invitation is still created in DB
    }

    return {
      invitationId: result.insertedId,
      email: normalizedEmail,
      boardName: board.title,
      expiresAt: new Date(expiredAt)
    }
  } catch (error) {
    throw error
  }
}

// Accept board invitation
const acceptInvitation = async (token, userId, userEmail) => {
  try {
    // 1. Find invitation by token
    const invitation = await invitationModel.findOneByToken(token)
    if (!invitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Lời mời không tồn tại hoặc đã bị hủy')
    }

    // 2. Check invitation status
    if (invitation.status !== invitationModel.INVITATION_STATUS.PENDING) {
      if (invitation.status === invitationModel.INVITATION_STATUS.ACCEPTED) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Lời mời này đã được chấp nhận trước đó')
      }
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Lời mời không hợp lệ')
    }

    // 3. Check if invitation is expired
    if (invitation.expiredAt < Date.now()) {
      // Update status to expired
      await invitationModel.update(invitation._id, {
        status: invitationModel.INVITATION_STATUS.EXPIRED
      })
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Lời mời đã hết hạn')
    }

    // 4. Verify email matches
    const normalizedUserEmail = userEmail.toLowerCase().trim()
    if (invitation.inviteeEmail !== normalizedUserEmail) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Lời mời này không dành cho email của bạn')
    }

    // 5. Get board and verify it still exists
    const board = await boardModel.findOneById(invitation.boardId.toString())
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board không còn tồn tại')
    }

    // 6. Check if user is already a member - with safe checks
    const memberIds = board.memberIds || []
    const ownerIds = board.ownerIds || []

    const isAlreadyMember = memberIds.some(
      memberId => memberId && memberId.toString() === userId.toString()
    )
    const isAlreadyOwner = ownerIds.some(
      ownerId => ownerId && ownerId.toString() === userId.toString()
    )

    if (!isAlreadyMember && !isAlreadyOwner) {
      // 7. Add user to board members
      await boardModel.update(invitation.boardId.toString(), {
        memberIds: [...memberIds.map(id => id.toString()), userId.toString()]
      })
    }

    // 8. Update invitation status to accepted
    await invitationModel.update(invitation._id, {
      status: invitationModel.INVITATION_STATUS.ACCEPTED
    })

    return {
      boardId: invitation.boardId.toString(),
      boardTitle: board.title
    }
  } catch (error) {
    throw error
  }
}

// Get all invitations for a board (optional - for listing pending invites)
const getBoardInvitations = async (boardId, userId) => {
  try {
    // Verify user has access to board
    const board = await boardModel.findOneById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board không tồn tại')
    }

    const ownerIds = board.ownerIds || []
    const isOwner = ownerIds.some(ownerId => ownerId && ownerId.toString() === userId.toString())
    if (!isOwner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền xem danh sách lời mời')
    }

    const invitations = await invitationModel.findByBoardId(boardId)
    return invitations
  } catch (error) {
    throw error
  }
}

export const invitationService = {
  createInvitation,
  acceptInvitation,
  getBoardInvitations
}
