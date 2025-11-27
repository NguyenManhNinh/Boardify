import { cardModel } from "~/models/cardModel"
import { columnModel } from "~/models/columnModel"

const createNew = async (reqBody, userId) => {
  try {
    const newCard = {
      ...reqBody,
      // Automatically add creator to memberIds
      memberIds: userId ? [userId] : (reqBody.memberIds || [])
    }
    const createCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  } catch (error) {
    throw error
  }
}

const getDetails = async (cardId) => {
  try {
    const card = await cardModel.findOneById(cardId)
    if (!card) {
      throw new Error('Card not found')
    }
    return card
  } catch (error) {
    throw error
  }
}

const update = async (cardId, updateData) => {
  try {
    const updateCard = await cardModel.update(cardId, {
      ...updateData,
      updatedAt: Date.now()
    })
    return updateCard
  } catch (error) {
    throw error
  }
}

const addAttachment = async (cardId, attachmentUrl) => {
  try {
    const card = await cardModel.findOneById(cardId)
    if (!card) {
      throw new Error('Card not found')
    }

    const currentAttachments = card.attachments || []
    const updatedCard = await cardModel.update(cardId, {
      attachments: [...currentAttachments, attachmentUrl],
      updatedAt: Date.now()
    })

    return updatedCard
  } catch (error) {
    throw error
  }
}

const removeAttachment = async (cardId, attachmentUrl) => {
  try {
    const card = await cardModel.findOneById(cardId)
    if (!card) {
      throw new Error('Card not found')
    }

    const currentAttachments = card.attachments || []
    const updatedCard = await cardModel.update(cardId, {
      attachments: currentAttachments.filter(url => url !== attachmentUrl),
      updatedAt: Date.now()
    })

    return updatedCard
  } catch (error) {
    throw error
  }
}

const setCover = async (cardId, coverData) => {
  try {
    const card = await cardModel.findOneById(cardId)
    if (!card) {
      throw new Error('Card not found')
    }

    const updatedCard = await cardModel.update(cardId, {
      cover: {
        type: coverData.type,
        url: coverData.url,
        thumbnailUrl: coverData.thumbnailUrl || null,
        attachmentId: coverData.attachmentId || null,
        color: coverData.color || null
      },
      updatedAt: Date.now()
    })

    return updatedCard
  } catch (error) {
    throw error
  }
}

const removeCover = async (cardId) => {
  try {
    const card = await cardModel.findOneById(cardId)
    if (!card) {
      throw new Error('Card not found')
    }

    const updatedCard = await cardModel.update(cardId, {
      cover: null,
      updatedAt: Date.now()
    })

    return updatedCard
  } catch (error) {
    throw error
  }
}

const setCoverFromAttachment = async (cardId, attachmentUrl) => {
  try {
    const card = await cardModel.findOneById(cardId)
    if (!card) {
      throw new Error('Card not found')
    }

    // Check if attachment exists in card
    const attachmentExists = card.attachments && card.attachments.includes(attachmentUrl)
    if (!attachmentExists) {
      throw new Error('Attachment not found in card')
    }

    // Determine type from file extension
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(attachmentUrl)
    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(attachmentUrl)

    // For YouTube/Vimeo links
    const isYouTube = attachmentUrl.includes('youtube.com') || attachmentUrl.includes('youtu.be')
    const isVimeo = attachmentUrl.includes('vimeo.com')

    let coverType = 'image' // default
    let thumbnailUrl = attachmentUrl

    if (isVideo || isYouTube || isVimeo) {
      coverType = 'video'
      // Generate YouTube thumbnail if it's a YouTube link
      if (isYouTube) {
        const videoId = attachmentUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
        thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : attachmentUrl
      }
    }

    const updatedCard = await cardModel.update(cardId, {
      cover: {
        type: coverType,
        url: attachmentUrl,
        thumbnailUrl: thumbnailUrl,
        attachmentId: attachmentUrl, // Using URL as ID for now since attachments are stored as strings
        color: null
      },
      updatedAt: Date.now()
    })

    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  getDetails,
  update,
  addAttachment,
  removeAttachment,
  setCover,
  removeCover,
  setCoverFromAttachment
}