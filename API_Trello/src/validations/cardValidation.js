import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).messages({ 'string.pattern.base': OBJECT_ID_RULE_MESSAGE }),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).messages({ 'string.pattern.base': OBJECT_ID_RULE_MESSAGE }),
    title: Joi.string().required().min(3).max(50).trim().strict()

  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().optional().allow('').max(3000),
    columnId: Joi.string().pattern(OBJECT_ID_RULE).messages({ 'string.pattern.base': OBJECT_ID_RULE_MESSAGE }),
    labels: Joi.array().items(Joi.object({
      text: Joi.string().allow('').max(50).trim(),
      color: Joi.string().required()
    })),
    checklists: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      items: Joi.array().items(Joi.object({
        text: Joi.string().required(),
        checked: Joi.boolean().default(false)
      }))
    })),
    dueDate: Joi.date().timestamp('javascript').allow(null),
    isDone: Joi.boolean(),
    memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE)),
    cover: Joi.object({
      type: Joi.string().valid('image', 'video', 'color').allow(null),
      url: Joi.string().uri().allow(null, ''),
      thumbnailUrl: Joi.string().uri().allow(null, ''),
      attachmentId: Joi.string().pattern(OBJECT_ID_RULE).allow(null),
      color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).allow(null)
    }).allow(null),
    comments: Joi.array().items(Joi.object({
      userId: Joi.string().pattern(OBJECT_ID_RULE).required(),
      userEmail: Joi.string().email().required(),
      userAvatar: Joi.string().optional(),
      content: Joi.string().required(),
      createdAt: Joi.date().timestamp('javascript').default(Date.now)
    })),
    attachments: Joi.array().items(Joi.string())
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const cardValidation = {
  createNew,
  update
}