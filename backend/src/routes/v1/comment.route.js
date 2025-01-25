const express = require('express');
const validate = require('../../middlewares/validate');
const { commentValidation } = require('../../validations');
const { commentController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(validate(commentValidation.getComment), auth('admin', 'reviewer'), commentController.getComments)
  .post(validate(commentValidation.addComment), auth('admin', 'reviewer'), commentController.addComment)
  .patch(validate(commentValidation.editComment), auth('admin', 'reviewer'), commentController.updateComment)
  .delete(validate(commentValidation.deleteComment), auth('admin', 'reviewer'), commentController.removeComment);

module.exports = router;
