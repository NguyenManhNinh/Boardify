import Joi, { date } from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'


const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(250).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  background: Joi.string().default('#0c66e4'),
  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
//Chỉ định ra những fields mà chúng ta không được phép update trong hàm update
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(valiData)
    return createBoard
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (boardId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findByUserId = async (userId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME)
      .find({
        $or: [
          { ownerIds: userId },
          { memberIds: userId }
        ],
        _destroy: false
      })
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (id) => {

  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({_id:new ObjectId(id)})
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          _destroy: false,
        }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'

        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'

        }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}
//Đẩy một phần tử ColumnId vào cuối mảng columnOrderIds
//Dùng $pull trong mongoDB ở trường hợp này để lấy một phần tử vào cuối mảng
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
//Lấy một phần tử columnId ra khỏi mảng columnOrderIds
//Dùng pull trong mongoDB ở trường hợp này để lấy một phần tử ra khỏi mảng rồi xóa nó đi
const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (boardId, updateData) => {
  try {
    //lọc những cái field không được phép update linh tinh
    Object.keys(updateData).forEach(fildName => {
      if (INVALID_UPDATE_FIELDS.includes(fildName)) {
        delete updateData[fildName]
      }
    })
    //Đối với những dữ liệu liên quan ObjectId biến đổi ở đây
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(_id)))
    }
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)

  }
}

const deleteOneById = async (boardId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(boardId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByUserId,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  deleteOneById
}