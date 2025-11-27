import express from 'express'
import { invitationValidation } from '~/validations/invitationValidation'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Accept invitation - note: this is at /v1/invitations/accept
Router.route('/accept')
  .post(
    authMiddleware,
    invitationValidation.acceptInvitation,
    invitationController.acceptInvitation
  )

export const invitationRoute = Router
