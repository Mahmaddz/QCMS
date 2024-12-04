const express = require('express');
const validate = require('../../middlewares/validate');
const { ayatValidation } = require('../../validations');
const { ayatController } = require('../../controllers');

const router = express.Router();

router.route('/info').get(validate(ayatValidation.getAyaInfo), ayatController.getAyatInfo);
router.route('/search').get(validate(ayatValidation.searchAya), ayatController.searchAyat);
router.route('/search-using-lemma').get(validate(ayatValidation.searchAya), ayatController.getAyatUsingLemmaApi);

module.exports = router;
