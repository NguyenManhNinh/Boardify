import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: '',
  labels: [], // array of labelIds
  members: [], // array of memberIds
  due: 'all' // 'all' | 'overdue' | 'today' | 'week' | 'no-due'
}

export const boardFilterSlice = createSlice({
  name: 'boardFilter',
  initialState,
  reducers: {
    setFilterText: (state, action) => {
      state.text = action.payload
    },
    toggleFilterLabel: (state, action) => {
      const labelId = action.payload
      if (state.labels.includes(labelId)) {
        state.labels = state.labels.filter(id => id !== labelId)
      } else {
        state.labels.push(labelId)
      }
    },
    toggleFilterMember: (state, action) => {
      const memberId = action.payload
      if (state.members.includes(memberId)) {
        state.members = state.members.filter(id => id !== memberId)
      } else {
        state.members.push(memberId)
      }
    },
    setFilterDue: (state, action) => {
      state.due = action.payload
    },
    resetFilters: (state) => {
      state.text = ''
      state.labels = []
      state.members = []
      state.due = 'all'
    }
  }
})

export const {
  setFilterText,
  toggleFilterLabel,
  toggleFilterMember,
  setFilterDue,
  resetFilters
} = boardFilterSlice.actions

export const selectBoardFilters = (state) => state.boardFilter

export default boardFilterSlice.reducer
