import { configureStore } from '@reduxjs/toolkit'
import activeCardReducer from './activeCard/activeCardSlice'
import boardReducer from './board/boardSlice'
import notificationsReducer from './notifications/notificationsSlice'
import automationReducer from './automation/automationSlice'
import boardFilterReducer from './board/boardFilterSlice'

export const store = configureStore({
  reducer: {
    activeCard: activeCardReducer,
    board: boardReducer,
    notifications: notificationsReducer,
    automation: automationReducer,
    boardFilter: boardFilterReducer
  }
})
