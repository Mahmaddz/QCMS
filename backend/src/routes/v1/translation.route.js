const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { translationValidation } = require('../../validations');
const { translationController } = require('../../controllers');
const { fileUploader } = require('../../middlewares/fileUploader');

const router = express.Router();

router
  .route('/upload/:authorName/:langId')
  .put(validate(translationValidation.upload), fileUploader, translationController.uploadTranslation);

module.exports = router;
