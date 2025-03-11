/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const httpStatus = require('http-status');
const { ArabicServices } = require('arabic-services');
const { ayatServices, wordsServices, arabicCustomServices, translationServices, tagsServices } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { fixAlif, fixLastYaa, fixInnerYaas, getUnicodeValues } = require('../utils/utilFunc');

const getVersesByTagsMatch = catchAsync(async (req, res) => {
  const { term, surah, aya } = req.query;
  const updatedTerm = ArabicServices.removeTashkeel(term);
  const data = await ayatServices.getAyatInfoByTags(updatedTerm, surah, aya);
  let suggestions = [];
  if (data.length === 0) {
    suggestions = await wordsServices.getSuggestedWords(updatedTerm.split(' '));
  }
  return res.status(httpStatus.OK).json({
    success: true,
    data,
    suggestions,
  });
});

const getAyatInfo = catchAsync(async (req, res) => {
  const { ayatText, ayaNo, suraNo } = req.query;
  const result = await ayatServices.getAyatInfo(ayatText, ayaNo, suraNo);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const searchAyat = catchAsync(async (req, res) => {
  const { term, words, surah, aya } = req.query;

  if (!term && !words) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Empty Query`);
  }

  let result;
  let suggestions;
  if (!words) {
    const removedDiacriticTerm = ArabicServices.removeTashkeel(term);
    const possibleMatchTerms = `${removedDiacriticTerm} ${fixLastYaa(removedDiacriticTerm)} ${fixAlif(removedDiacriticTerm)} ${fixInnerYaas(removedDiacriticTerm)}`;
    possibleMatchTerms.split(' ').forEach((item) => console.log(item, getUnicodeValues(item)));
    result = await ayatServices.getSuraAndAyaFromMushafUsingTerm(possibleMatchTerms, surah, aya);
    if (Object.keys(result.wordsList.lemmas).length === 0) {
      suggestions = await wordsServices.getSuggestedWords(removedDiacriticTerm.split(' '));
    }
  } else {
    const wordArr = wordsServices.splitCommaSeparated(words);
    result = await ayatServices.getAyaAndSuraUsingWords(wordArr, surah, aya);
    const wordsList = await wordsServices.getSuggestedWordsBasedOnTerm(wordArr.join(' '));
    result.counts = { wordCount: wordsList.wordsCount, verseCount: result.verseCount }
    result.otherWords = {
      rootsWords: await wordsServices.getWordsByRoot(Object.keys(wordsList.roots), Object.keys(wordsList.lemmas)),
    };
  }
  res.status(httpStatus.OK).json({
    success: true,
    message: result.surahAndAyaList && result.surahAndAyaList.length > 0 ? 'Data Received' : 'Nothing Found',
    words: result.wordsList || [],
    otherWords: result.otherWords || [],
    data: result.surahAndAyaList || [],
    suggestions: Array.from(suggestions || []),
    counts: result.counts,
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

// RETURNS VERSE IN TEXTUAL
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
  const verseArr = ayaNo ? wordsServices.splitCommaSeparated(ayaNo) : [];
  const result = await ayatServices.getVerseWordsBySuraNoAndAyaNo(suraNo, verseArr);
  const ayat = ayaNo ? result[0].Verse : undefined;
  const translation = await translationServices.getSuraTranslations(suraNo, ayat);
  const tags = await tagsServices.tagsRelatedToSurahAndAyah([{ suraNo, ayaNo }]);
  return res.status(httpStatus.OK).json({
    success: true,
    ayat: result,
    translation,
    tags,
  });
});

const getVerseInWordsArray = catchAsync(async (req, res) => {
  const { surahAyaList } = req.body;
  const result = await ayatServices.getCompleteVerseData(surahAyaList);
  return res.status(httpStatus.OK).json({
    success: true,
    result,
    message: result.length > 0 && 'Data Received' || 'Empty',
  })
}) 

module.exports = {
  getAyatInfo,
  searchAyat,
  getAyatUsingLemmaApi,
  getCompleteSurah,
  getVerseInWords,
  getVersesByTagsMatch,
  getVerseInWordsArray,
};
