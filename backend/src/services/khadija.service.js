/* eslint-disable no-param-reassign */
const { Sequelize, Khadija, Op } = require('../models');

const getAyaAndSuraUsingConceptArabic = async (conceptValues, suraNo, ayaNo) => {
  suraNo = suraNo === 0 || suraNo === null ? false : suraNo;
  ayaNo = ayaNo === 0 || ayaNo === null ? false : ayaNo;

  const results = await Khadija.findAll({
    attributes: [
      [Sequelize.col('chapter_ID'), 'suraNo'],
      [Sequelize.col('verse_ID'), 'ayaNo'],
      [Sequelize.col('Concept_Arabic'), 'conceptArabic'],
      [Sequelize.fn('ARRAY_AGG', Sequelize.col('ARABIC_WORD')), 'arabicWords'],
      [Sequelize.fn('ARRAY_AGG', Sequelize.col('word_ID')), 'wordIds'],
    ],
    where: {
      [Op.or]: conceptValues.map((value) => ({
        Concept_Arabic: { [Op.iLike]: `%${value}%` },
      })),
      ...(suraNo && { chapter_ID: suraNo }),
      ...(ayaNo && { verse_ID: ayaNo }),
    },
    group: ['chapter_ID', 'verse_ID', 'Concept_Arabic'],
    order: [
      ['chapter_ID', 'ASC'],
      ['verse_ID', 'ASC'],
    ],
  });
  return results.map((list) => list.dataValues);
};

module.exports = {
  getAyaAndSuraUsingConceptArabic,
};
