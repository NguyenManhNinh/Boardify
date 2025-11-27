import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationController } from '~/controllers/invitationController'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware, boardController.getAllBoards)
  .post(authMiddleware, boardValidation.createNew, boardController.createNew)

//Api hỗ trợ di chuyển card giữa các column
Router.route('/supports/moving_cards')
  .put(boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)
  .delete(authMiddleware, boardController.deleteBoard)

Router.route('/:id/backup/google-drive')
  .post(authMiddleware, boardController.backupToGoogleDrive)

// Member management routes
Router.route('/:id/members')
  .get(authMiddleware, boardController.getBoardMembers)
  .post(authMiddleware, boardController.addMember)

Router.route('/:id/members/:userId')
  .delete(authMiddleware, boardController.removeMember)

// Invitation routes
Router.route('/:id/invitations')
  .post(
    authMiddleware,
    invitationValidation.sendInvitation,
    invitationController.sendInvitation
  )
  .get(authMiddleware, invitationController.getBoardInvitations)

export const boardRoute = Router
