import { createSlice } from '@reduxjs/toolkit'
import { getUserBoards } from '~/services/boardsService'

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    currentBoard: null,
    myBoards: [],
    boardsLoading: false,
    boardsError: null
  },
  reducers: {
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload
    },
    clearCurrentBoard: (state) => {
      state.currentBoard = null
    },
    setMyBoards: (state, action) => {
      state.myBoards = action.payload
    },
    setBoardsLoading: (state, action) => {
      state.boardsLoading = action.payload
    },
    setBoardsError: (state, action) => {
      state.boardsError = action.payload
    },
    addBoard: (state, action) => {
      state.myBoards.unshift(action.payload)
    }
  }
})

export const {
  setCurrentBoard,
  clearCurrentBoard,
  setMyBoards,
  setBoardsLoading,
  setBoardsError,
  addBoard
} = boardSlice.actions

export const selectCurrentBoard = (state) => state.board.currentBoard
export const selectMyBoards = (state) => state.board.myBoards
export const selectBoardsLoading = (state) => state.board.boardsLoading
export const selectBoardsError = (state) => state.board.boardsError

// Thunk action to fetch boards
export const fetchMyBoards = () => async (dispatch) => {
  try {
    dispatch(setBoardsLoading(true))
    const response = await getUserBoards()
    dispatch(setMyBoards(response.data || []))
    dispatch(setBoardsError(null))
  } catch (error) {
    dispatch(setBoardsError(error.message))
  } finally {
    dispatch(setBoardsLoading(false))
  }
}

export default boardSlice.reducer
