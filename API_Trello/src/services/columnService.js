import { columnModel } from "~/models/columnModel"
import { boardModel } from "~/models/boardModel"
import { cardModel } from "~/models/cardModel"
import { ApiError } from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"

const createNew=async(reqBody)=>{
  try {
    const newColumn={
      ...reqBody
    }
    const createColumn=await columnModel.createNew(newColumn)
    const getNewColumn=await columnModel.findOneById(createColumn.insertedId)

    if(getNewColumn){
      //Xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards=[]

      //Cập nhật lại mảng columnOrderIds trong bảng collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw error
  }
}
const update=async(columnId,reqBody)=>{
  try {
    const updateData={
      ...reqBody,
      updatedAt:Date.now()
    }
    const updatedColumn=await columnModel.update(columnId,updateData)
    return updatedColumn
  } catch (error) {
    throw error
  }
}
const deleteItem=async(columnId)=>{
  try {
    const tagertColumn=await columnModel.findOneById(columnId)
    console.log('~file:columnService.js:47~deleteItem~targetColumn:',tagertColumn)
    if(!tagertColumn){
      throw new ApiError(StatusCodes.NOT_FOUND,'Column not found')
    }
  //Xóa column
  await columnModel.deleteOneById(columnId)
  //Xóa toàn bộ Card thuộc column đó
  await cardModel.deleteManyByColumnId(columnId)
  //Xóa columnId trong mảng columnOrderIds của Board chứa nó
  await boardModel.pullColumnOrderIds(tagertColumn)
  return {deleteResult:'Cột và các thẻ của nó đã được xóa thành công'}
  } catch (error) {
    throw error
  }
}
export const columnService={
  
  createNew,
  update,
  deleteItem
}