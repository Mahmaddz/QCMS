const express = require('express');
const validate = require('../../middlewares/validate');
const { wordsValidation } = require('../../validations');
const { wordsController } = require('../../controllers');

const router = express.Router();

router.route('/').get(validate(wordsValidation.getAyaWordsValidation), wordsController.getWords);

module.exports = router;
