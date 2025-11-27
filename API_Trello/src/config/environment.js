import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,

  // Fix typo: BUILD_MODE is set by the npm scripts via cross-env
  BUILD_MODE: process.env.BUILD_MODE || process.env.BUILD_MODLE || 'dev',

  AUTHOR: process.env.AUTHOR,

  JWT_SECRET: process.env.JWT_SECRET || (() => {
    throw new Error('SECURITY ERROR: JWT_SECRET must be set in .env file')
  })(),

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

  // Email Service Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  // Frontend URL for invitation links
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Invitation token expiry (in days)
  INVITATION_TOKEN_EXPIRY_DAYS: parseInt(process.env.INVITATION_TOKEN_EXPIRY_DAYS) || 7
}