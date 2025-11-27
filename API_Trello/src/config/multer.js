import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const nameWithoutExt = path.basename(file.originalname, ext)
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext)
  }
})

// File filter - only allow certain types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Archives
    'application/zip',
    'application/x-zip-compressed'
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, documents, and archives are allowed.'), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

export default upload
