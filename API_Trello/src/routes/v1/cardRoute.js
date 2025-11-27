import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import upload from '~/config/multer'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(cardValidation.createNew, cardController.createNew)

Router.route('/:id')
  .get(cardController.getDetails)
  .put(cardValidation.update, cardController.update)

Router.route('/:id/attachments')
  .post(authMiddleware, upload.single('file'), cardController.uploadAttachment)
  .delete(authMiddleware, cardController.deleteAttachment)

Router.route('/:id/cover')
  .patch(authMiddleware, cardController.setCover)
  .delete(authMiddleware, cardController.removeCover)

Router.route('/:id/cover/from-attachment')
  .post(authMiddleware, cardController.setCoverFromAttachment)

export const cardRoute = Router