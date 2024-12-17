/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const xlsx = require('xlsx');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { logger } = require('../config/logger');
const { Qurana, Verse, Word, Khadija, Mushaf } = require('../models');

const BATCH_SIZE = 1000;

const quranaInsertBulk = async (data) => {
  try {
    const mappedData = data.map((d) => ({
      surahId: d.SurahId,
      ayahId: d.AyahId,
      segmentId: d.SegmentId,
      conceptNameAr: d.ConceptName,
      conceptNameEn: d.ConceptGloss,
    }));
    await Qurana.destroy({ truncate: true });
    await Qurana.bulkCreate(mappedData);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `QURANA ERROR OCCURED`);
  }
};

const verseInsertBulk = async (data) => {
  try {
    const mappedData = data.map((d) => ({
      jozz: d.jozz,
      page: d.page,
      suraNo: d.sura_no,
      suraNameEn: d.sura_name_en,
      suraNameAr: d.sura_name_ar,
      ayaNo: d.aya_no,
      uthmaniTextDiacritics: d['Uthmani-text-diacritics'],
      emlaeyTextNoDiacritics: d['Emlaey-Text-no-diacritics'],
      emlaeyTextDiacritics: d['Emlaey-Text-diacritics'],
      englishTranslation: d['English-Translation1 (Y Ali)'],
    }));
    await Verse.sequelize.query('TRUNCATE "Verses" CASCADE');
    // await Verse.destroy({ truncate: true });
    for (let i = 0; i < mappedData.length; i += BATCH_SIZE) {
      await Verse.bulkCreate(mappedData.slice(i, i + BATCH_SIZE));
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `VERSE ERROR OCCURED`);
  }
};

const wordInsertBulk = async (data) => {
  try {
    const mappedData = data.map((d) => ({
      ayaId: d['aya id'],
      surahId: d['sura id'],
      suraName: d['sura name'],
      word: d.word,
      root: d.root,
    }));
    await Word.destroy({ truncate: true });
    await Word.bulkCreate(mappedData);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `WORDS ERROR OCCURED`);
  }
};

const khadijaInsertBulk = async (data) => {
  try {
    const mappedData = data.map((d) => ({
      Seg_ID: d.Seg_ID,
      LOCATION: d.LOCATION,
      chapter_ID: d.chapter_ID,
      verse_ID: d.verse_ID,
      word_ID: d.word_ID,
      segment_ID: d.segment_ID,
      TRANS: d.TRANS,
      POS: d.POS,
      ANT: d.ANT,
      Concept: d.Concept,
      MORPH: d.MORPH,
      ARABIC_WORD: d.ARABIC_WORD,
      Concept_Arabic: d.Concept_Arabic,
      Concept_English: d.Concept_English,
      dist_s: d.dist_s,
      dist_v: d.dist_v,
      dist_w: d.dist_w,
      gender: d.gender,
      number: d.number,
      person: d.person,
    }));
    await Khadija.destroy({ truncate: true });
    await Khadija.bulkCreate(mappedData);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `KHADIJA ERROR OCCURED`);
  }
};

const mushafInsertBulk = async (data) => {
  for (let i = 0; i < 10; i += 1) {
    console.log(data[i].word);
    console.log('count ->', i);
  }
  try {
    const mappedData = data.map((d) => ({
      is_chapter_name: d.is_chapter_name,
      is_basmalla: d.is_basmalla,
      Chapter: d['Chapter number'],
      Verse: d['Verse number'],
      word: d.word,
      Stem: d.Stem,
      Stem_pattern: d['Stem pattern'],
      PoS_tags: d['PoS tags'],
      Lemma: d.Lemma,
      lemma_pattern: d['lemma pattern'],
      Root: d.Root !== '#' ? d.Root : null,
      firstRoot: d.first_root,
      wordUndiacritizedWithHamza: d.word_undiacritized_withhamza,
      wordUndiacritizedNoHamza: d.word_undiacritized_nohamza,
      firstUndiacWithHamza: d.first_undiac_withhamza,
      wawRemove: d.waw_remove,
      revise: d.revise,
      lastYaa: d.last_yaa,
      wordLastLetterUndiacritizedWithHamza: d['word_last letter_undiacritized_withhamza'],
      wordLastLetterUndiacritizedNoHamza: d['word_last letter_undiacritized_nohamza'],
      wordNowaw: d.word__nowaw,
      wordUndiacritizedWithHamzaNowaw: d.word_undiacritized_withhamza_nowaw,
      wordUndiacritizedNoHamzaNowaw: d.word_undiacritized_nohamza_nowaw,
      wordLastLetterUndiacritizedWithHamzaNowaw: d['word_last letter_undiacritized_withhamza_nowaw'],
      wordLastLetterUndiacritizedNoHamzaNowaw: d['word_last letter_undiacritized_nohamza_nowaw'],
      wordNoyaa: d.word__noyaa,
      wordUndiacritizedWithHamzaNoyaa: d.word_undiacritized_withhamza_noyaa,
      wordUndiacritizedNoHamzaNoyaa: d.word_undiacritized_nohamza_noyaa,
      wordLastLetterUndiacritizedWithHamzaNoyaa: d['word_last letter_undiacritized_withhamza_noyaa'],
      wordLastLetterUndiacritizedNoHamzaNoyaa: d['word_last letter_undiacritized_nohamza_noyaa'],
      camelLemma: d.camel_lemma,
      camelRoot: d.camel_root,
      camelStem: d.camel_stem,
      camelPos: d.camel_pos,
      camelGloss: d.camel_gloss,
      camelDiac: d.camel_diac,
      camelPattern: d.camel_pattern,
      tashaphyneStem: d.tashaphyne_stem,
      tStemVsKhStem: d['T stem vs kh stem'],
      tashaphyneRoot: d.tashaphyne_root,
      sameStartWord: d['same_start word'],
    }));
    await Mushaf.sequelize.query('TRUNCATE TABLE "Mushaf" RESTART IDENTITY CASCADE');
    for (let i = 0; i < mappedData.length; i += BATCH_SIZE) {
      await Mushaf.bulkCreate(mappedData.slice(i, i + BATCH_SIZE));
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `MUSHAF ERROR OCCURED`);
  }
};

const getSheetColumnNames = async (sheet) => {
  return xlsx.utils.sheet_to_json(sheet, { header: 1 })[0] || [];
};

const getRequiredColumns = (sheetName) => {
  const requiredColumns = {
    verses: [
      'id',
      'jozz',
      'page',
      'sura_no',
      'sura_name_en',
      'sura_name_ar',
      'aya_no',
      'Uthmani-text-diacritics',
      'Emlaey-Text-no-diacritics',
      'Emlaey-Text-diacritics',
      'English-Translation1 (Y Ali)',
    ],
    khadija: [
      'Seg_ID',
      'LOCATION',
      'chapter_ID',
      'verse_ID',
      'word_ID',
      'segment_ID',
      'TRANS',
      'POS',
      'ANT',
      'Concept',
      'MORPH',
      'ARABIC_WORD',
      'Concept_Arabic',
      'Concept_English',
      'dist_s',
      'dist_v',
      'dist_w',
      'gender',
      'number',
      'person',
      // 'chapter_type',
    ],
    mushaf: [
      'is_chapter_name',
      'is_basmalla',
      'Chapter number',
      'Verse number',
      'word',
      'Stem',
      'Stem pattern',
      'PoS tags',
      'Lemma',
      'lemma pattern',
      'Root',
      'first_root',
      'word_undiacritized_withhamza',
      'word_undiacritized_nohamza',
      'first_undiac_withhamza',
      'waw_remove',
      'revise',
      'last_yaa',
      'word_last letter_undiacritized_withhamza',
      'word_last letter_undiacritized_nohamza',
      'word__nowaw',
      'word_undiacritized_withhamza_nowaw',
      'word_undiacritized_nohamza_nowaw',
      'word_last letter_undiacritized_withhamza_nowaw',
      'word_last letter_undiacritized_nohamza_nowaw',
      'word__noyaa',
      'word_undiacritized_withhamza_noyaa',
      'word_undiacritized_nohamza_noyaa',
      'word_last letter_undiacritized_withhamza_noyaa',
      'word_last letter_undiacritized_nohamza_noyaa',
      'camel_lemma',
      'camel_root',
      'camel_stem',
      'camel_pos',
      'camel_gloss',
      'camel_diac',
      'camel_pattern',
      'tashaphyne_stem',
      'T stem vs kh stem',
      'tashaphyne_root',
      'same_start word',
    ],
    Sample: ['sura id', 'aya id', 'sura name', 'word', 'root', 'page'],
    Qurana: ['RecordId', 'SurahId', 'AyahId', 'SegmentId', 'ConceptName', 'ConceptGloss'],
  };

  const columns = requiredColumns[sheetName] || [];

  if (columns && columns.length === 0) {
    logger.error('sheetName', sheetName);
    throw new ApiError(httpStatus.CONFLICT, `Sheet Name (${sheetName}) Not Found`);
  }

  return columns;
};

const hasRequiredColumns = (requiredColumns, sheetColumns) => requiredColumns.every((item) => sheetColumns.includes(item));

const getDataFromSheet = async (sheet) => {
  try {
    return xlsx.utils.sheet_to_json(sheet);
  } catch (error) {
    logger.error('Error reading XLSX file:', error);
    throw new ApiError(httpStatus.CONFLICT, `Failed to read the sheet`);
  }
};

const readXlxsFile = async (file) => {
  try {
    return xlsx.read(file, { type: 'buffer' });
  } catch (error) {
    logger.error('Error reading XLSX file:', error);
    throw new ApiError(httpStatus.CONFLICT, `Failed to read the file`);
  }
};

module.exports = {
  getSheetColumnNames,
  getRequiredColumns,
  hasRequiredColumns,
  getDataFromSheet,
  readXlxsFile,
  quranaInsertBulk,
  verseInsertBulk,
  wordInsertBulk,
  khadijaInsertBulk,
  mushafInsertBulk,
};
