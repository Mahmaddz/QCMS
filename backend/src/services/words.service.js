/* eslint-disable no-console */
const httpStatus = require('http-status');
const { ArabicServices } = require('arabic-services');
const { Sequelize, sequelize, Op, Word, Mushaf } = require('../models');
const { logger } = require('../config/logger');
const ApiError = require('../utils/ApiError');
// const sphql = require('../config/sphinxql');

const getWordsBasedOnSuraAndAyat = async (suraNo, ayaNo) => {
  try {
    const query = `
      SELECT 
        CONCAT(v."suraNo", ':', v."ayaNo", ' - ', v."suraNameAr", ' - ', v."suraNameEn") AS "suraAyaInfo",
        v."ayaNo",
        v."suraNo",
        v."suraNameEn", 
        v."suraNameAr", 
        w."word",
        w."root"
      FROM 
        public."Verses" AS v
      JOIN 
        public."Words" AS w 
      ON 
        w."surahId" = v."suraNo" 
        AND w."ayaId" = v."ayaNo"
      WHERE 
        v."suraNo" = :suraNo
        AND v."ayaNo" = :ayaNo
      ORDER BY 
        w."surahId", w."ayaId", w."id";
    `;

    // Execute the raw query with replacements for parameters
    const results = await sequelize.query(query, {
      replacements: { suraNo: Number.parseInt(suraNo, 10), ayaNo: Number.parseInt(ayaNo, 10) },
      type: Sequelize.QueryTypes.SELECT,
    });

    return results.join(' ');
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Words Based on Sura & Aya didn't execute correctly`);
  }
};

const splitCommaSeparated = (words) => {
  if (words.includes(' ') || words.length === 0) throw new ApiError(httpStatus.CONFLICT, `Words are not sent properly`);
  return words
    .trim()
    .split(',')
    .filter((word) => word)
    .map((item) => ArabicServices.removeTashkeel(item));
};

const getWordsUsingRoot = async (rootWords) => {
  try {
    const result = await Word.findAll({
      attributes: ['id', 'surahId', 'ayaId', 'suraName', 'word', 'root'],
      where: {
        root: rootWords,
      },
    });
    const result2 = result.map((row) => ({
      ...row,
      wordsInSI: ArabicServices.removeTashkeel(row.word),
    }));
    return result2;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};

const getSurahAndAyaByCncptArabicWords = async (conceptArabicList) => {
  const conceptPatterns = conceptArabicList.map((concept) => `%${concept}%`);

  const query = `
    SELECT 
      CONCAT(v."suraNo", ':', v."ayaNo", ' - ', v."suraNameAr", ' - ', v."suraNameEn") AS "suraAyaInfo",
      v."suraNo",
      v."ayaNo",
      v."suraNameEn", 
      v."suraNameAr", 
      v."uthmaniTextDiacritics", 
      v."emlaeyTextNoDiacritics", 
      v."englishTranslation"
    FROM "Khadijas" AS k
    JOIN "Verses" AS v 
      ON v."suraNo" = k."chapter_ID" AND v."ayaNo" = k."verse_ID"
    WHERE k."Concept_Arabic" ILIKE ANY (ARRAY[:conceptPatterns])
    GROUP BY 
      v."suraNo",
      v."ayaNo",
      v."suraNameEn", 
      v."suraNameAr", 
      v."uthmaniTextDiacritics", 
      v."emlaeyTextNoDiacritics", 
      v."englishTranslation";
  `;

  const result = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: { conceptPatterns },
  });

  return result;
};

const getSuggestedWordsBasedOnTerm = async (term) => {
  const results = await Mushaf.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('word')), 'Stem'], 'Lemma', 'word'],
    where: {
      word: {
        [Op.or]: term.split(' ').map((t) => ({ [Op.like]: t })),
      },
    },
  });
  return term.split(' ').map((t) => {
    const termMatches = results.filter((match) => match.word.includes(t));
    return {
      t,
      stemList: termMatches.map((item) => item.Stem),
      lemma: termMatches.length > 0 ? termMatches[0].Lemma : null,
    };
  });
};

const getSuggestedWords = async (keywords) => {
  if (!keywords.length) {
    return new Set();
  }

  const matchQuery = keywords.map((keyword) => `*${keyword}*`).join(' | ');
  console.log(keywords, '=>', matchQuery);

  // const { results } = await sphql
  //   .getQueryBuilder()
  //   .select('word')
  //   .from('mushaf_words_idx')
  //   .match('word', matchQuery)
  //   .execute();

  const results = 'lsk';

  return new Set(results.map((r) => r.word));
};

module.exports = {
  getWordsBasedOnSuraAndAyat,
  splitCommaSeparated,
  getWordsUsingRoot,
  getSurahAndAyaByCncptArabicWords,
  getSuggestedWordsBasedOnTerm,
  getSuggestedWords,
};
