const httpStatus = require('http-status');
const { ArabicServices } = require('arabic-services');
const { ayatServices, wordsServices } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const getAyatInfo = catchAsync(async (req, res) => {
  const { ayatText, ayaNo, suraNo } = req.query;
  const result = await ayatServices.getAyatInfo(ayatText, ayaNo, suraNo);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const searchAyat = catchAsync(async (req, res) => {
  const { term, words } = req.query;

  if (!term && !words) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Empty Query`);
  }

  let result;
  let suggestions;
  if (!words) {
    const updatedTerm = ArabicServices.removeTashkeel(term);
    result = await ayatServices.getSuraAndAyaFromMushafUsingTerm(updatedTerm);
    if (result.lemmaNotFound[0] && result.lemmaNotFound.length > 0) {
      suggestions = await wordsServices.getSuggestedWords(result.lemmaNotFound);
    }
  } else {
    const wordArr = wordsServices.splitCommaSeparated(words);
    result = await ayatServices.getSuraAndAyaUsingWords(wordArr);
  }
  res.status(httpStatus.OK).json({
    success: true,
    message: result.surahAndAyaList.length > 0 ? 'Data Received' : 'Nothing Found',
    data: result.surahAndAyaList,
    searchedFor: result.conceptArabicList,
    suggestions: Array.from(suggestions || []),
  });
});

module.exports = {
  getAyatInfo,
  searchAyat,
};
