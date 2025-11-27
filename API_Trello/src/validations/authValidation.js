import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const register = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.email': 'Email must be a valid email',
      'string.empty': 'Email is not allowed to be empty'
    }),
    password: Joi.string().required().min(6).messages({
      'any.required': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is not allowed to be empty'
    }),
    username: Joi.string().required().trim().strict().messages({
      'any.required': 'Username is required',
      'string.empty': 'Username is not allowed to be empty'
    }),
    displayName: Joi.string().optional().trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.email': 'Email must be a valid email',
      'string.empty': 'Email is not allowed to be empty'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is not allowed to be empty'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateProfile = async (req, res, next) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().optional().trim().strict(),
    avatar: Joi.string().optional()
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

export const authValidation = {
  register,
  login,
  updateProfile
}
