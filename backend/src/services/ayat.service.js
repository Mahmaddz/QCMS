/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { ArabicServices } = require('arabic-services');
const { logger } = require('../config/logger');
const { Sequelize, Op, Verse, sequelize, Mushaf, Tag, Translation } = require('../models');
const ApiError = require('../utils/ApiError');
const wordsServices = require('./words.service');
const translationServices = require('./translation.service');
const tagsServices = require('./tags.service');

const getAyatInfo = async (ayatText, ayaNo, suraNo) => {
  if (suraNo === 0 || suraNo === null) suraNo = false;
  if (ayaNo === 0 || ayaNo === null) ayaNo = false;
  try {
    const isEnglishInput = /^[a-zA-Z\s]*$/.test(ayatText);
    const searchColumn = isEnglishInput ? 'englishTranslation' : 'emlaeyTextNoDiacritics';

    const verses = await Verse.findAll({
      attributes: [
        [
          Sequelize.fn(
            'concat',
            Sequelize.col('suraNo'),
            ':',
            Sequelize.col('ayaNo'),
            '-',
            Sequelize.col('suraNameAr'),
            '-',
            Sequelize.col('suraNameEn')
          ),
          'suraAyaInfo',
        ],
        'suraNo',
        'ayaNo',
        'uthmaniTextDiacritics',
        'emlaeyTextNoDiacritics',
        'englishTranslation',
      ],
      where: {
        [searchColumn]: {
          [Op.like]: `%${ArabicServices.removeTashkeel(ayatText)}%`,
        },
        ...(ayaNo && { ayaNo }),
        ...(suraNo && { suraNo }),
      },
    });

    return verses;
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Query did not executed well`);
  }
};

const getAyaatBySuraAndAyaId = (suraNo, ayaNo) => {
  return Verse.findAll({
    attributes: [
      [
        Sequelize.fn(
          'concat',
          Sequelize.col('suraNo'),
          ':',
          Sequelize.col('ayaNo'),
          '-',
          Sequelize.col('suraNameAr'),
          '-',
          Sequelize.col('suraNameEn')
        ),
        'suraAyaInfo',
      ],
      'suraNo',
      'ayaNo',
      'uthmaniTextDiacritics',
      'emlaeyTextNoDiacritics',
      'englishTranslation',
    ],
    where: {
      ...(suraNo && { suraNo }),
      ...(ayaNo && { ayaNo }),
    },
  });
};

const searchAyatUsingTerm = async (rootTerm) => {
  try {
    const wordsDiscvrdUsngRoot = await wordsServices.getWordsUsingRoot(rootTerm); // words
    const conceptArabicList = [...new Set(wordsDiscvrdUsngRoot.map((item) => item.wordsInSI))];
    if (conceptArabicList.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, `No Root Matched`);
    }
    const surahAndAyaList = await wordsServices.getSurahAndAyaByCncptArabicWords(conceptArabicList); // khadija and verses
    return { surahAndAyaList, conceptArabicList };
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Query did not executed well`);
  }
};

const searchAyatUsingTermAndWords = async (conceptArabicList) => {
  try {
    const surahAndAyaList = await wordsServices.getSurahAndAyaByCncptArabicWords(conceptArabicList);
    return { surahAndAyaList, conceptArabicList };
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Query did not executed well`);
  }
};

const getAyaAndSuraUsingWords = async (words, surah, aya) => {
  const { rows: results, count } = await Mushaf.findAndCountAll({
    attributes: [
      [Sequelize.col('Chapter'), 'suraNo'],
      [Sequelize.col('Verse'), 'ayaNo'],
      [Sequelize.fn('ARRAY_AGG', Sequelize.col('wordLastLetterUndiacritizedWithHamza')), 'wordsInAya'],
      [Sequelize.fn('COUNT', Sequelize.col('wordLastLetterUndiacritizedWithHamza')), 'wordsCount'],
    ],
    where: {
      wordLastLetterUndiacritizedWithHamza: { [Op.in]: words },
      is_basmalla: 0,
      is_chapter_name: 0,
      ...(surah && { Chapter: surah }),
      ...(aya ? { Verse: aya } : { Verse: { [Op.ne]: 0 } }),
    },
    group: ['Chapter', 'Verse'],
    order: [
      // ['wordsCount', 'DESC'],
      ['Chapter', 'ASC'],
      ['Verse', 'ASC'],
    ],
    // offset: 0,
    // limit: 2,
    raw: true,
  });

  return { surahAndAyaList: results || [], verseCount: count.length };
};

/**
 * Verse Count
 * Words Count
 */

const getSuraAndAyaFromMushafUsingTerm = async (term, surah, aya) => {
  const wordsList = await wordsServices.getSuggestedWordsBasedOnTerm(term); // (roots and lemmas) of matched words
  const lemmaList = Object.keys(wordsList.lemmas);
  const undiacritizedLemmaList = Object.keys(wordsList.LemmaUndiacritized);
  const otherWords = {
    lemmasWords: await wordsServices.getWordsByLemma(undiacritizedLemmaList),
    rootsWords: await wordsServices.getWordsByRoot(Object.keys(wordsList.roots), undiacritizedLemmaList),
  };
  const uniqueLemmas = new Set(Object.values(wordsList.LemmaUndiacritized).flat());
  const resultz = lemmaList.length !== 0 ? await getAyaAndSuraUsingWords(Array.from(uniqueLemmas), surah, aya) : [];
  return {
    surahAndAyaList: resultz.surahAndAyaList,
    wordsList,
    otherWords,
    counts: { wordCount: wordsList.wordsCount, verseCount: resultz.verseCount },
  };
};

const getCompleteSurahWithAyaats = async (sura) => {
  if (!sura) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, `Sura No. and Aya No. did not found`);
  try {
    const verses = await Verse.findAll({
      attributes: [
        [Sequelize.col('suraNameEn'), 'suraNameEn'],
        [Sequelize.col('suraNameAr'), 'suraNameAr'],
        [Sequelize.col('ayaNo'), 'ayaNo'],
        [Sequelize.col('uthmaniTextDiacritics'), 'uthmani'],
        [Sequelize.col('emlaeyTextNoDiacritics'), 'noDiaEmlaye'],
        [Sequelize.col('emlaeyTextDiacritics'), 'emlaye'],
      ],
      where: { suraNo: sura },
      order: [['ayaNo', 'ASC']],
    });

    const translate = await translationServices.getSuraTranslations(sura);

    const expectedOutPut = verses.map((verse) => {
      return {
        ...verse.dataValues,
        translation: translate
          .filter((trans) => trans.aya === verse.ayaNo)
          .map((trans) => ({ text: trans.text, langCode: trans.language.code })),
      };
    });

    return expectedOutPut;
  } catch (error) {
    throw new ApiError(httpStatus.GATEWAY_TIMEOUT, `getCompleteSurahWithAyaats failed to execute`);
  }
};

const getVerseWordsBySuraNoAndAyaNo = async (sura, aya = []) => {
  const results = await Mushaf.findAll({
    attributes: ['Chapter', 'Verse', 'word', 'Stem_pattern', 'PoS_tags', 'wordUndiacritizedNoHamza'],
    where: {
      Chapter: sura,
      Verse: {
        [Op.ne]: 0,
      },
      ...(aya.length > 0 && { Verse: { [Op.in]: aya } }),
      is_basmalla: 0,
    },
    order: [['id', 'ASC']],
  });
  return results;
};

const getVerseWordsBySuraNoAndAyaNoArr = async (suraAyaList) => {
  const results = await Mushaf.findAll({
    attributes: ['Chapter', 'Verse', 'word', 'Stem_pattern', 'PoS_tags', 'wordUndiacritizedNoHamza'],
    where: {
      [Op.or]: suraAyaList.map(({ suraNo, ayaNo }) => ({
        Chapter: suraNo,
        Verse: ayaNo,
      })),
      is_basmalla: 0,
    },
    order: [['id', 'ASC']],
  });
  return results;
};

const getSurahNameBySuraNo = async (sura) => {
  const result = await Verse.findAll({
    attributes: [[Sequelize.fn('CONCAT', Sequelize.col('suraNameAr'), ' - ', Sequelize.col('suraNameEn')), 'suraAyaInfo']],
    where: {
      suraNo: sura,
    },
    limit: 1,
  });
  return result[0].dataValues.suraAyaInfo;
};

const getSuraAndAyaUsingRoots = async (roots) => {
  try {
    const results = await sequelize.query(
      `
      SELECT 
        CONCAT(v."suraNo", ':', v."ayaNo", ' - ', v."suraNameAr", ' - ', v."suraNameEn") AS "suraAyaInfo",
        v."suraNo",
        v."ayaNo",
        v."suraNameEn", 
        v."suraNameAr", 
        v."uthmaniTextDiacritics", 
        v."emlaeyTextNoDiacritics", 
        v."englishTranslation",
        m."word",
        STRING_AGG(DISTINCT m."word", ', ') AS "uniqueWords",
        COUNT(DISTINCT m."Lemma") AS "unique_lemma_count"
      FROM "Mushaf" m
      JOIN "Verses" v ON m."Chapter" = v."suraNo" AND m."Verse" = v."ayaNo"
      WHERE m."Root" IN (:roots)
      GROUP BY 
        v."suraNo",
        v."ayaNo",
        v."suraNameEn", 
        v."suraNameAr", 
        v."uthmaniTextDiacritics", 
        v."emlaeyTextNoDiacritics", 
        v."englishTranslation",
        m."word"
      ORDER BY 
        "unique_lemma_count" DESC, v."suraNo", v."ayaNo";
    `,
      {
        replacements: { roots },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const conceptArabicList = [
      ...new Set(results.flatMap((item) => item.uniqueWords.split(',').map((word) => word.trim()))),
    ];
    const surahAndAyaList = results.map(({ uniqueWords, ...otherFields }) => otherFields);

    return { surahAndAyaList, conceptArabicList };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAyatInfoByTags = async (term, sura, aya) => {
  const ayahList = await tagsServices.suraAndAyaByTagMatch(term, sura, aya);
  return ayahList;
};

const getCompleteVerseData = async (suraAyaList) => {
  try {
    const results = await Mushaf.findAll({
      attributes: [
        ['Chapter', 'suraNo'],
        ['Verse', 'ayaNo'],
        [
          Sequelize.literal(`ARRAY_AGG(DISTINCT jsonb_build_object(
            'id', "Mushaf"."id",
            'word', "Mushaf"."word",
            'Stem_pattern', "Mushaf"."Stem_pattern",
            'PoS_tags', "Mushaf"."PoS_tags",
            'wordUndiacritizedNoHamza', "Mushaf"."wordUndiacritizedNoHamza"
          ))`),
          'verses',
        ],
        [
          Sequelize.literal(`ARRAY_AGG(DISTINCT jsonb_build_object(
            'text', "Translations"."text",
            'translatorId', "Translations"."translatorId"
          ))`),
          'translations',
        ],
        [
          Sequelize.literal(`ARRAY_AGG(DISTINCT jsonb_build_object(
            'id', "Tags"."id",
            'en', "Tags"."category",
            'ar', "Tags"."arabic"
          ))`),
          'tags',
        ],
      ],
      include: [
        {
          model: Tag,
          required: false,
          attributes: [],
          on: {
            suraNo: { [Op.col]: 'Mushaf.Chapter' },
            ayaNo: { [Op.col]: 'Mushaf.Verse' },
            statusId: 2,
          },
        },
        {
          model: Translation,
          required: false,
          attributes: [],
          on: {
            sura: { [Op.col]: 'Mushaf.Chapter' },
            aya: { [Op.col]: 'Mushaf.Verse' },
          },
        },
      ],
      where: {
        [Op.or]: suraAyaList.map(({ suraNo, ayaNo }) => (ayaNo ? { Chapter: suraNo, Verse: ayaNo } : { Chapter: suraNo })),
        Verse: { [Op.ne]: 0 },
        is_basmalla: 0,
      },
      group: ['Chapter', 'Verse'],
      order: [
        ['Chapter', 'ASC'],
        ['Verse', 'ASC'],
      ],
      raw: true,
    });

    return results;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new ApiError(httpStatus.BAD_GATEWAY, error.message);
  }
};

module.exports = {
  getAyatInfo,
  searchAyatUsingTerm,
  searchAyatUsingTermAndWords,
  getAyaatBySuraAndAyaId,
  getSuraAndAyaFromMushafUsingTerm,
  getSuraAndAyaUsingRoots,
  getCompleteSurahWithAyaats,
  getVerseWordsBySuraNoAndAyaNo,
  getVerseWordsBySuraNoAndAyaNoArr,
  getCompleteVerseData,
  getSurahNameBySuraNo,
  getAyaAndSuraUsingWords,
  getAyatInfoByTags,
};
