const express = require('express');
const validate = require('../../middlewares/validate');
const { ayatValidation } = require('../../validations');
const { ayatController, khadijaController } = require('../../controllers');

const router = express.Router();

router.route('/info').get(validate(ayatValidation.getAyaInfo), ayatController.getAyatInfo);
router.route('/search').get(validate(ayatValidation.searchAya), ayatController.searchAyat);
router.route('/search-using-root').get(validate(ayatValidation.searchAya), ayatController.getAyatUsingLemmaApi);
router.route('/surah').get(validate(ayatValidation.surahAPIvalidation), ayatController.getCompleteSurah);
router.route('/verse-words').get(validate(ayatValidation.surahAPIvalidation), ayatController.getVerseInWords);
router.route('/reference').get(validate(ayatValidation.searchAya), khadijaController.getSuraAndAyaListByConceptArabic);

module.exports = router;
