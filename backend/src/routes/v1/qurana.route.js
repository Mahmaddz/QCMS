const express = require('express');
const validate = require('../../middlewares/validate');
const { quranaValidation } = require('../../validations');
const { quranaController } = require('../../controllers');

const router = express.Router();

router.route('/info').get(validate(quranaValidation.getQuranaInfo), quranaController.getQuaraInfo);

module.exports = router;
