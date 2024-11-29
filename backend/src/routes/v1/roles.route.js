const express = require('express');
const auth = require('../../middlewares/auth');
const { rolesController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth('admin'), rolesController.getRoles);

module.exports = router;
