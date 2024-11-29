const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { fileValidation } = require('../../validations');
const { fileController } = require('../../controllers');
const { fileUploader } = require('../../middlewares/fileUploader');

const router = express.Router();

router
  .route('/upload/:fileNature')
  .put(validate(fileValidation.uploadValidation), auth('admin'), fileUploader, fileController.fileUpload);

module.exports = router;
