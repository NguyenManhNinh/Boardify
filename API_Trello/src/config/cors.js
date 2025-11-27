import { WHITELIST_DOMAINS } from '~/utils/constants'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Cấu hình CORS Option trong dự án thực tế (Video số 62 trong chuỗi MERN Stack Pro)
export const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔍 CORS Check - Origin:', origin);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS Allow - No origin (Postman/curl)');
      return callback(null, true)
    }

    // Check if origin is in whitelist or is localhost:8080
    if (WHITELIST_DOMAINS.includes(origin) || origin === 'http://localhost:8080') {
      console.log('✅ CORS Allow - Whitelist match');
      return callback(null, true)
    }

    // Allow all localhost origins for development
    if (origin.startsWith('http://localhost:')) {
      console.log('✅ CORS Allow - Localhost origin');
      return callback(null, true)
    }

    // Return error if origin is not allowed
    console.log('❌ CORS Block - Origin not allowed');
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request, (Nhá hàng :D | Ở khóa MERN Stack Advance nâng cao học trực tiếp mình sẽ hướng dẫn các bạn đính kèm jwt access token và refresh token vào httpOnly Cookies)
  credentials: true
}