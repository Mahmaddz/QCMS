const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { tagsController } = require('../../controllers');
const { tagValidation } = require('../../validations');

const router = express.Router();

router.route('/add').post(auth('admin', 'reviewer'), validate(tagValidation.addTag), tagsController.addTag);
router.route('/delete').delete(auth('admin', 'reviewer'), validate(tagValidation.deleteTag), tagsController.deleteTag);
router.route('/update').patch(auth('admin', 'reviewer'), validate(tagValidation.updateTag), tagsController.updateTag);
router.route('/change-status').patch(auth('admin'), validate(tagValidation.changeTagStatus), tagsController.changeTagStatus);

module.exports = router;
