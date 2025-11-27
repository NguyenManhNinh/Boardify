/**
 * Updated by trungquandev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  cover: Joi.object({
    type: Joi.string().valid('image', 'video', 'color').default(null),
    url: Joi.string().uri().allow(null, '').default(null),
    thumbnailUrl: Joi.string().uri().allow(null, '').default(null),
    attachmentId: Joi.string().pattern(OBJECT_ID_RULE).allow(null).default(null),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).allow(null).default(null)
  }).allow(null).default(null),
  memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE)).default([]),
  comments: Joi.array().items(Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).required(),
    userEmail: Joi.string().email().required(),
    userAvatar: Joi.string().optional(),
    content: Joi.string().required(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now)
  })).default([]),
  attachments: Joi.array().items(Joi.string()).default([]),

  labels: Joi.array().items(Joi.object({
    text: Joi.string().allow('').max(50).trim(),
    color: Joi.string().required()
  })).default([]),

  checklists: Joi.array().items(Joi.object({
    title: Joi.string().required(),
    items: Joi.array().items(Joi.object({
      text: Joi.string().required(),
      checked: Joi.boolean().default(false)
    })).default([])
  })).default([]),

  dueDate: Joi.date().timestamp('javascript').default(null),
  isDone: Joi.boolean().default(false),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const newCardToAdd = {
      ...valiData,
      boardId: new ObjectId(valiData.boardId),
      columnId: new ObjectId(valiData.columnId)
    }
    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (cardId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(cardId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    //lọc những cái field không được phép update linh tinh
    Object.keys(updateData).forEach(fildName => {
      if (INVALID_UPDATE_FIELDS.includes(fildName)) {
        delete updateData[fildName]
      }
    })
    //Đối với những dữ liệu liên quan đến ObjectId,biến đổi ở đây(tùy sau này nếu cần thì tách function riêng)
    if (updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: new ObjectId(columnId) })
    console.log('~file:cardModel.js:79~deleteManyByColumnId~result:', result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByBoardId = async (boardId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({
      boardId: new ObjectId(boardId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  deleteManyByBoardId
}
