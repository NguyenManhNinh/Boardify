import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Get Profile (require authentication)
Router.get('/profile', authMiddleware, userController.getProfile)

// Get Recent Activities (require authentication)
Router.get('/activities', authMiddleware, userController.getRecentActivities)

// Hide Activity (require authentication)
Router.post('/activities/hide', authMiddleware, userController.hideActivity)

// Update Bio (require authentication)
Router.put('/bio', authMiddleware, userController.updateBio)

// Update Avatar (require authentication)
Router.post('/avatar', authMiddleware, userController.updateAvatar)

// Update Settings (require authentication)
Router.put('/settings', authMiddleware, userController.updateSettings)

// Change Password (require authentication)
Router.post('/change-password', authMiddleware, userController.changePassword)

// Search Users (require authentication)
Router.get('/', authMiddleware, userController.getUsers)

export const userRoute = Router
