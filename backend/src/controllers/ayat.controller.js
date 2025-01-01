/* eslint-disable no-console */
const httpStatus = require('http-status');
const { ArabicServices } = require('arabic-services');
const { ayatServices, wordsServices, arabicCustomServices, translationServices } = require('../services');
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
    if (Object.keys(result.wordsList.lemmas).length === 0) {
      suggestions = await wordsServices.getSuggestedWords(updatedTerm.split(' '));
    }
  } else {
    const wordArr = wordsServices.splitCommaSeparated(words);
    result = await ayatServices.getAyaAndSuraUsingWords(wordArr);
  }
  res.status(httpStatus.OK).json({
    success: true,
    message: result.surahAndAyaList && result.surahAndAyaList.length > 0 ? 'Data Received' : 'Nothing Found',
    words: result.wordsList || [],
    otherWords: result.otherWords || [],
    data: result.surahAndAyaList || [],
    suggestions: Array.from(suggestions || []),
  });
});

const getAyatUsingLemmaApi = catchAsync(async (req, res) => {
  const { term } = req.query;

  const roots = await arabicCustomServices.getRootUsingAlKhalil(term);
  const result = ayatServices.getSuraAndAyaUsingRoots(roots);

  // const suggestions =
  //   result.rootNotFound[0] && result.rootNotFound.length > 0
  //     ? await wordsServices.getSuggestedWords(result.rootNotFound)
  //     : [];

  res.status(httpStatus.OK).json({
    success: true,
    message: result.surahAndAyaList.length > 0 ? 'Data Received' : 'Nothing Found',
    data: result.surahAndAyaList,
    searchedFor: result.conceptArabicList,
    // suggestions: Array.from(suggestions),
  });
});

const getCompleteSurah = catchAsync(async (req, res) => {
  const result = await ayatServices.getCompleteSurahWithAyaats(req.query.suraNo);
  return res.status(httpStatus.OK).json({
    success: true,
    result: {
      totalAyats: result.length,
      ayaat: result,
    },
  });
});

const getVerseInWords = catchAsync(async (req, res) => {
  const { suraNo, ayaNo } = req.query;
  const verseArr = wordsServices.splitCommaSeparated(ayaNo);
  const result = await ayatServices.getVerseWordsBySuraNoAndAyaNo(suraNo, verseArr);
  const name = await ayatServices.getSurahNameBySuraNo(suraNo);
  const translation = await translationServices.getSuraTranslations(suraNo, result[0].Verse);
  return res.status(httpStatus.OK).json({
    success: true,
    suraName: name,
    ayat: result,
    translation,
  });
});

module.exports = {
  getAyatInfo,
  searchAyat,
  getAyatUsingLemmaApi,
  getCompleteSurah,
  getVerseInWords,
};
