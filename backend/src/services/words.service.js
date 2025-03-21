/* eslint-disable no-console */
const httpStatus = require('http-status');
const { ArabicServices } = require('arabic-services');
const { Sequelize, sequelize, Op, Word, Mushaf } = require('../models');
const { logger } = require('../config/logger');
const ApiError = require('../utils/ApiError');
const sphql = require('../config/sphinxql');

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
    .filter((word) => word);
  // .map((item) => ArabicServices.removeTashkeel(item));
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

const getSuggestedWordsBasedOnTerm = async (termVal, Chapter = undefined, Verse = undefined) => {
  const searchValue = [...new Set(termVal.split(' '))];

  const fields = [
    'word',
    'wordLastLetterUndiacritizedWithHamza',
    'wordLastLetterUndiacritizedNoHamza',
    'wordUndiacritizedWithHamza',
    'wordUndiacritizedNoHamza',
    'wordLastLetterUndiacritizedWithHamzaNowaw',
    'wordLastLetterUndiacritizedNoHamzaNowaw',
    'wordUndiacritizedWithHamzaNowaw',
    'wordUndiacritizedNoHamzaNowaw',
  ];

  const { rows: results, count } = await Mushaf.findAndCountAll({
    attributes: [
      'id',
      'Chapter',
      'Verse',
      'Root',
      'Lemma',
      'LemmaUndiacritized',
      'word',
      'wordLastLetterUndiacritizedWithHamza',
    ],
    where: {
      ...(Chapter && { Chapter }),
      ...(Verse ? { Verse } : { Verse: { [Op.ne]: 0 } }),
      [Op.and]: [
        // { Root: { [Op.ne]: '#' } },
        {
          [Op.or]: fields.map((field) => ({
            [field]: {
              [Op.iLike]: { [Op.any]: searchValue.map((term) => `${term}`) },
            },
          })),
        },
      ],
    },
    order: [
      ['id', 'ASC'],
      ['Chapter', 'ASC'],
      ['Verse', 'ASC'],
    ],
  });

  const lemmaMap = new Map();
  const undiaLemmaMap = new Map();
  const rootMap = new Map();

  results.forEach((r) => {
    // ========== LEMMA ==========
    if (lemmaMap.has(r.Lemma)) {
      const words = lemmaMap.get(r.Lemma) || [];
      if (!words.includes(r.wordLastLetterUndiacritizedWithHamza)) {
        lemmaMap.set(r.Lemma, [...words, r.wordLastLetterUndiacritizedWithHamza]);
      }
    } else {
      lemmaMap.set(r.Lemma, [r.wordLastLetterUndiacritizedWithHamza]);
    }
    // ========== ROOT ==========
    if (rootMap.has(r.Root)) {
      const words = lemmaMap.get(r.Root) || [];
      if (!words.includes(r.wordLastLetterUndiacritizedWithHamza)) {
        rootMap.set(r.Root, [...words, r.wordLastLetterUndiacritizedWithHamza]);
      }
    } else {
      rootMap.set(r.Root, [r.wordLastLetterUndiacritizedWithHamza]);
    }
    // ========== ROOT ==========
    if (undiaLemmaMap.has(r.LemmaUndiacritized)) {
      const words = lemmaMap.get(r.LemmaUndiacritized) || [];
      if (!words.includes(r.wordLastLetterUndiacritizedWithHamza)) {
        undiaLemmaMap.set(r.LemmaUndiacritized, [...words, r.wordLastLetterUndiacritizedWithHamza]);
      }
    } else {
      undiaLemmaMap.set(r.LemmaUndiacritized, [r.wordLastLetterUndiacritizedWithHamza]);
    }
  });
  return {
    lemmas: Object.fromEntries(lemmaMap.entries()),
    roots: Object.fromEntries(rootMap.entries()),
    LemmaUndiacritized: Object.fromEntries(undiaLemmaMap.entries()),
    wordsCount: count,
  };
};

const getSuggestedWords = async (keywords) => {
  if (!keywords.length) {
    return new Set();
  }
  const matchQuery = keywords.map((keyword) => `*${keyword}*`).join(' | ');
  let r = [];

  try {
    const { results } = await sphql
      .getQueryBuilder()
      .select('wordLastLetterUndiacritizedNoHamza as word', 'WEIGHT() AS relevance')
      .from('mushaf_words_idx')
      .match('wordUndiacritizedNoHamzaNowaw', matchQuery)
      .option('ranker', `SPH04`)
      .execute();
    r = results;
  } catch (error) {
    console.error(error);
    r = [];
  }

  return Array.from(new Set(r.map((re) => re.word)));
};

const getWordsByLemma = async (wordsArray) => {
  const words = await Mushaf.findAll({
    attributes: [
      'Lemma',
      [Sequelize.fn('ARRAY_AGG', Sequelize.fn('DISTINCT', Sequelize.col('wordLastLetterUndiacritizedWithHamza'))), 'words'],
    ],
    where: {
      LemmaUndiacritized: { [Op.in]: wordsArray },
    },
    group: ['Lemma'],
    raw: true,
  });

  return Object.fromEntries(words.map(({ Lemma, word }) => [Lemma, word]));
};

const getWordsByRoot = async (wordsArray, prefferedLemmas = []) => {
  const wordz = await Mushaf.findAll({
    attributes: [
      [Sequelize.col('wordLastLetterUndiacritizedWithHamza'), 'word'],
      'Lemma',
      'Root',
      'LemmaUndiacritized',
      [Sequelize.fn('COUNT', Sequelize.col('wordLastLetterUndiacritizedWithHamza')), 'count'],
    ],
    where: {
      Root: {
        [Op.in]: wordsArray,
      },
      is_basmalla: 0,
      is_chapter_name: 0,
      Verse: {
        [Op.ne]: 0,
      },
      ...(prefferedLemmas.length && {
        [Op.or]: [{ Root: { [Op.ne]: '#' } }, { Root: '#', LemmaUndiacritized: { [Op.in]: prefferedLemmas } }],
      }),
    },
    group: ['wordLastLetterUndiacritizedWithHamza', 'Lemma', 'Root', 'LemmaUndiacritized'],
  });

  const map = new Map();
  wordz.forEach((w) => {
    const { word, Lemma, Root, count } = w.dataValues;
    if (!map.has(Root)) {
      map.set(Root, new Map());
    }
    const rootMap = map.get(Root);
    if (!rootMap.has(Lemma)) {
      rootMap.set(Lemma, []);
    }
    rootMap.get(Lemma).push({ word, count });
  });

  return Array.from(map.entries()).map(([root, lemmaMap]) => {
    return {
      root,
      lemmas: Object.fromEntries(lemmaMap.entries()),
    };
  });
};

module.exports = {
  getWordsBasedOnSuraAndAyat,
  splitCommaSeparated,
  getWordsUsingRoot,
  getSurahAndAyaByCncptArabicWords,
  getSuggestedWordsBasedOnTerm,
  getSuggestedWords,
  getWordsByLemma,
  getWordsByRoot,
};
