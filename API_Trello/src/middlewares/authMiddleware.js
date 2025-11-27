import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

export const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token not provided'))
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET)
    console.log('🔍 JWT decoded:', decoded)
    req.jwtDecoded = decoded

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token expired'))
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'))
    }
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication failed'))
  }
}
