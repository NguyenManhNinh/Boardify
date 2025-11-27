import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import crypto from 'crypto'

const INVITATION_COLLECTION_NAME = 'boardInvitations'

// Status constants
const INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
}

const INVITATION_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  inviterId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  inviteeEmail: Joi.string().email().required().trim().lowercase(),
  token: Joi.string().required(),
  status: Joi.string()
    .valid(
      INVITATION_STATUS.PENDING,
      INVITATION_STATUS.ACCEPTED,
      INVITATION_STATUS.EXPIRED,
      INVITATION_STATUS.CANCELLED
    )
    .default(INVITATION_STATUS.PENDING),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  expiredAt: Joi.date().timestamp('javascript').required(),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'token']

const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Generate secure random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Create new invitation
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    // Convert string IDs to ObjectId
    const invitationData = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      inviterId: new ObjectId(validData.inviterId)
    }
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(invitationData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Find invitation by token
const findOneByToken = async (token) => {
  try {
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({
      token: token,
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Find pending invitation by board and email
const findPendingByBoardAndEmail = async (boardId, email) => {
  try {
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({
      boardId: new ObjectId(boardId),
      inviteeEmail: email.toLowerCase(),
      status: INVITATION_STATUS.PENDING,
      _destroy: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Update invitation status
const update = async (invitationId, updateData) => {
  try {
    // Filter invalid update fields
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(invitationId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Get all invitations for a board
const findByBoardId = async (boardId) => {
  try {
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME)
      .find({
        boardId: new ObjectId(boardId),
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  INVITATION_STATUS,
  createNew,
  findOneByToken,
  findPendingByBoardAndEmail,
  update,
  findByBoardId,
  generateToken
}
