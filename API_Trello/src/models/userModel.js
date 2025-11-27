import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  id: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().optional().default('').trim().strict(),
  avatar: Joi.string().optional().default(''),
  phone: Joi.string().optional().default('').trim().strict(),
  bio: Joi.string().optional().default('').trim().strict(),
  stats: Joi.object({
    boardsCreated: Joi.number().default(0),
    tasksCompleted: Joi.number().default(0),
    totalLists: Joi.number().default(0),
    activeBoards: Joi.number().default(0)
  }).optional().default({}),
  role: Joi.string().valid('client', 'admin').default('client'),
  isActive: Joi.boolean().default(true),
  verifyToken: Joi.string().optional().default(null),
  googleId: Joi.string().optional().default(null),
  googleProvider: Joi.object({
    id: Joi.string().optional(),
    email: Joi.string().email().optional(),
    accessToken: Joi.string().optional(),
    refreshToken: Joi.string().optional()
  }).optional().default(null),
  passwordResetToken: Joi.string().optional().default(null),
  passwordResetExpires: Joi.date().timestamp('javascript').optional().default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'email']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email,
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByUsername = async (username) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      username: username,
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    // Remove invalid fields
    INVALID_UPDATE_FIELDS.forEach(field => {
      delete updateData[field]
    })

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByResetToken = async (token) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      passwordResetToken: token,
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByGoogleId = async (googleId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      googleId: googleId,
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneByEmail,
  findOneByUsername,
  findOneById,
  findOneByResetToken,
  findOneByGoogleId,
  update
}
