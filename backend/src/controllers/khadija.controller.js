/* eslint-disable no-console */
const httpStatus = require('http-status');
const { ArabicServices } = require('arabic-services');
const catchAsync = require('../utils/catchAsync');
const { khadijaServices } = require('../services');

const getSuraAndAyaListByConceptArabic = catchAsync(async (req, res) => {
  const { term, surah, aya } = req.query;
  const result = await khadijaServices.getAyaAndSuraUsingConceptArabic(
    ArabicServices.removeTashkeel(term).split(' '),
    surah,
    aya
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: result.length > 0 ? 'Data Received' : 'Nothing Found',
    data: result,
  });
});

module.exports = {
  getSuraAndAyaListByConceptArabic,
};
