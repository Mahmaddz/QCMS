const express = require('express');
const { languageController } = require('../../controllers');

const router = express.Router();

router.route('/language-list').get(languageController.getListOfLanguages);

module.exports = router;
