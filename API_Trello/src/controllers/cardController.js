import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?.id
    const createdCard = await cardService.createNew(req.body, userId)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const card = await cardService.getDetails(cardId)
    res.status(StatusCodes.OK).json(card)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const updatedCard = await cardService.update(cardId, req.body)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) {
    next(error)
  }
}

const uploadAttachment = async (req, res, next) => {
  try {
    const cardId = req.params.id

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' })
    }

    // Generate the file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    // Add attachment to card
    const updatedCard = await cardService.addAttachment(cardId, fileUrl)

    res.status(StatusCodes.OK).json({
      message: 'File uploaded successfully',
      file: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      card: updatedCard
    })
  } catch (error) {
    next(error)
  }
}

const deleteAttachment = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const { attachmentUrl } = req.body

    if (!attachmentUrl) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Attachment URL is required' })
    }

    const updatedCard = await cardService.removeAttachment(cardId, attachmentUrl)

    res.status(StatusCodes.OK).json({
      message: 'Attachment deleted successfully',
      card: updatedCard
    })
  } catch (error) {
    next(error)
  }
}

const setCover = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const updatedCard = await cardService.setCover(cardId, req.body)
    res.status(StatusCodes.OK).json({
      message: 'Cover set successfully',
      card: updatedCard
    })
  } catch (error) {
    next(error)
  }
}

const removeCover = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const updatedCard = await cardService.removeCover(cardId)
    res.status(StatusCodes.OK).json({
      message: 'Cover removed successfully',
      card: updatedCard
    })
  } catch (error) {
    next(error)
  }
}

const setCoverFromAttachment = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const { attachmentUrl } = req.body

    if (!attachmentUrl) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Attachment URL is required' })
    }

    const updatedCard = await cardService.setCoverFromAttachment(cardId, attachmentUrl)
    res.status(StatusCodes.OK).json({
      message: 'Cover set from attachment successfully',
      card: updatedCard
    })
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew,
  getDetails,
  update,
  uploadAttachment,
  deleteAttachment,
  setCover,
  removeCover,
  setCoverFromAttachment
}