const httpStatus = require('http-status');
const { wordsServices } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getWords = catchAsync(async (req, res) => {
  const result = await wordsServices.getWordsBasedOnSuraAndAyat(req.query.suraNo, req.query.ayaNo);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

module.exports = {
  getWords,
};
