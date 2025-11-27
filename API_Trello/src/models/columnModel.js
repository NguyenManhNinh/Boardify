
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
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']
const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const newColumnToAdd = {
      ...valiData,
      boardId: new ObjectId(valiData.boardId)
    }
    const createdColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
    return createdColumn
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (columnId) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(columnId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
// nhiêm vụ của func này là push một cái giá trị cardId vào cuối mảng cardOrderIds
const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      { $push: { cardOrderIds: new ObjectId(card._id) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (columnId, updateData) => {
  try {
    //lọc những cái field không được phép update linh tinh
    Object.keys(updateData).forEach(fildName => {
      if (INVALID_UPDATE_FIELDS.includes(fildName)) {
        delete updateData[fildName]
      }
    })
    //Đối với những dữ liệu liên quan ObjectId biến đổi ở đây
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(_id => (new ObjectId(_id)))
    }
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(columnId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)

  }
}
const deleteOneById = async (columnId) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(columnId) })
    console.log('~file:columnModel.js:94~deleteOneById~result:', result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByBoardId = async (boardId) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteMany({
      boardId: new ObjectId(boardId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById,
  deleteManyByBoardId
}
