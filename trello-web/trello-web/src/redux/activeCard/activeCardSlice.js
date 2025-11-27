import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null,
  isShowModal: false
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showCardDetailModal: (state, action) => {
      state.isShowModal = true
      state.currentActiveCard = action.payload
    },
    hideCardDetailModal: (state) => {
      state.isShowModal = false
      state.currentActiveCard = null
    },
    updateCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    }
  }
})

// Export actions
export const { showCardDetailModal, hideCardDetailModal, updateCurrentActiveCard } = activeCardSlice.actions

// Export selectors
export const selectIsShowModal = (state) => state.activeCard.isShowModal
export const selectCurrentActiveCard = (state) => state.activeCard.currentActiveCard

// Export reducer
export default activeCardSlice.reducer
