import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const getProfile = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const result = await userService.getProfile(userId)
    // Disable caching to always get fresh stats
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getRecentActivities = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const result = await userService.getRecentActivities(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const hideActivity = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const { activityId } = req.body
    const result = await userService.hideActivity(userId, activityId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateBio = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const result = await userService.updateBio(userId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const result = await userService.updateAvatar(userId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateSettings = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const result = await userService.updateSettings(userId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.id
    const result = await userService.changePassword(userId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getUsers = async (req, res, next) => {
  try {
    const { q } = req.query
    const result = await userService.getUsers(q)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getProfile,
  getRecentActivities,
  hideActivity,
  updateBio,
  updateAvatar,
  updateSettings,
  changePassword,
  getUsers
}
