import { createSlice } from '@reduxjs/toolkit'

const NOTIFICATIONS_KEY = 'trello_notifications'

// LocalStorage helpers
const loadNotificationsFromStorage = () => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveNotificationsToStorage = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
  } catch {
    // Silent fail
  }
}

const initialState = {
  notifications: loadNotificationsFromStorage()
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        ...action.payload,
        createdAt: Date.now(),
        isRead: false
      }
      state.notifications.unshift(notification)

      // Keep max 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }

      // Save to localStorage
      saveNotificationsToStorage(state.notifications)
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.isRead = true
        saveNotificationsToStorage(state.notifications)
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.isRead = true)
      saveNotificationsToStorage(state.notifications)
    },
    clearNotifications: (state) => {
      state.notifications = []
      saveNotificationsToStorage([])
    }
  }
})

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications
} = notificationsSlice.actions

export const selectNotifications = (state) => state.notifications.notifications
export const selectUnreadCount = (state) =>
  state.notifications.notifications.filter(n => !n.isRead).length

export default notificationsSlice.reducer
