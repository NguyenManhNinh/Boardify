import express from 'express'
import { authController } from '~/controllers/authController'
import { authValidation } from '~/validations/authValidation'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Register
Router.post('/register', authValidation.register, authController.register)

// Login
Router.post('/login', authValidation.login, authController.login)

// Logout (require authentication)
Router.post('/logout', authMiddleware, authController.logout)

// Get Profile (require authentication)
Router.get('/profile', authMiddleware, authController.getProfile)

// Update Profile (require authentication)
Router.put('/profile', authMiddleware, authValidation.updateProfile, authController.updateProfile)

// Avatar endpoints
Router.post('/avatar', authMiddleware, authController.updateAvatar)
Router.get('/avatar/:fileId', authController.getAvatarFile)

// Google OAuth
Router.get('/google', authController.googleLogin)
Router.get('/google/callback', authController.googleCallback)

// Forgot Password
Router.post('/forgot-password', authController.forgotPassword)

// Reset Password
Router.post('/reset-password', authController.resetPassword)

export const authRoute = Router
