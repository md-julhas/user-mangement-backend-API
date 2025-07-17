const multer = require("multer")

const {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_USER_IMAGE_DIRECTORY,
} = require("../config")

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_USER_IMAGE_DIRECTORY)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File type is not allowed"), false)
  }
  cb(null, true)
}

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
})

module.exports = uploadUserImage
