/* eslint-disable no-unused-vars */
const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const FileSystem = require('../utils/FileSystem');

// MEMORY STORAGE
const memoryStorage = multer.memoryStorage();

// Configuring Multer for Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { fileNature } = req.params;
    if (!['tags', 'verses'].includes(fileNature)) {
      return cb(new Error('File nature is not correctly defined'));
    }
    const absolutePath = path.join(__dirname, `../../uploads/${fileNature}`);
    FileSystem.createDirectory(absolutePath);
    cb(null, absolutePath);
  },
  filename(req, file, cb) {
    let fileName = file.originalname;
    const ext = fileName.split('.').pop();
    fileName = fileName.split('.').slice(0, -1).join('.');
    cb(null, `${fileName}-${Date.now()}.${ext}`);
  },
});

const fileFilterHandler = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const allowedFileTypes = ['.xls', '.xlsx'];
  if (!allowedFileTypes.includes(ext)) {
    return cb(new ApiError(httpStatus.NOT_ACCEPTABLE, `Only [${allowedFileTypes.join(', ')}] files are allowed`), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilterHandler,
  // limits: { fileSize: 2 * 1024 * 1024 }, // *MB
});

// List of All Uploader Middlewares
const fileUploader = upload.single('file');
const filesUploader = upload.array('files');

module.exports = {
  fileUploader,
  filesUploader,
};
