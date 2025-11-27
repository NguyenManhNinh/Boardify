import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Validation for sending invitation
const sendInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().lowercase().messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
  }
}

// Validation for accepting invitation
const acceptInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({
    token: Joi.string().required().trim().messages({
      'string.empty': 'Token không được để trống',
      'any.required': 'Token là bắt buộc'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ')
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
  }
}

export const invitationValidation = {
  sendInvitation,
  acceptInvitation
}
