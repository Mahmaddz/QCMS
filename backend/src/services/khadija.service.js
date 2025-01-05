/* eslint-disable no-param-reassign */
const { Sequelize, Khadija, Op } = require('../models');

const getAyaAndSuraUsingConceptArabic = async (conceptValues, suraNo, ayaNo) => {
  suraNo = suraNo === 0 || suraNo === null ? false : suraNo;
  ayaNo = ayaNo === 0 || ayaNo === null ? false : ayaNo;
  const results = await Khadija.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('chapter_ID')), 'suraNo'],
      ['verse_ID', 'ayaNo'],
    ],
    where: {
      [Op.or]: conceptValues.map((value) => ({
        Concept_Arabic: {
          [Op.iLike]: `%${value}%`,
        },
      })),
      ...(suraNo && { chapter_ID: suraNo }),
      ...(ayaNo && { verse_ID: ayaNo }),
    },
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
