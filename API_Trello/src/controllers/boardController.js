import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    console.log('DEBUG: createNew Board - userId:', userId)
    const createdBoard = await boardService.createNew(req.body, userId)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getAllBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const boards = await boardService.getAllBoards(userId)
    res.status(StatusCodes.OK).json({ data: boards })
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    // console.log('req.params',req.params)
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}
const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)
    console.log('DEBUG: update Board - boardId:', boardId)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}
const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.jwtDecoded.id

    const result = await boardService.deleteBoard(boardId, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const backupToGoogleDrive = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.jwtDecoded.id
    const result = await boardService.backupToGoogleDrive(boardId, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getBoardMembers = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const members = await boardService.getBoardMembers(boardId)
    res.status(StatusCodes.OK).json({ data: members })
  } catch (error) {
    next(error)
  }
}

const addMember = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const currentUserId = req.jwtDecoded.id
    const { userId } = req.body

    const result = await boardService.addMember(boardId, userId, currentUserId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const removeMember = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const userIdToRemove = req.params.userId
    const currentUserId = req.jwtDecoded.id

    const result = await boardService.removeMember(boardId, userIdToRemove, currentUserId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getAllBoards,
  getDetails,
  update,
  moveCardToDifferentColumn,
  deleteBoard,
  backupToGoogleDrive,
  getBoardMembers,
  addMember,
  removeMember
}