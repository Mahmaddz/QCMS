const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const { Sequelize, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');

const getQuranaDataBasedOnConcept = async (conceptValue, ayaNo, suraNo) => {
  try {
    // Initialize the base query and bind values array
    let query = `
      SELECT 
          CONCAT(v."suraNo", ':', v."ayaNo", ' - ', v."suraNameAr", ' - ', v."suraNameEn") AS "suraAyaInfo",
          v."uthmaniTextDiacritics",
          v."emlaeyTextNoDiacritics",
          v."englishTranslation",
          q."conceptNameAr",
          q."conceptNameEn",  
          v."ayaNo",
          v."suraNo"
      FROM 
          "Quranas" AS q
      JOIN 
          "Verses" AS v 
      ON 
          q."surahId" = v."suraNo" AND q."ayahId" = v."ayaNo"
      WHERE 
          (q."conceptNameAr" ILIKE '%' || $1 || '%' OR q."conceptNameEn" ILIKE '%' || $1 || '%')
    `;

    // Array to hold bind values
    const bindValues = [conceptValue];

    // Conditionally add filters for ayaNo and suraNo if they are defined
    if (ayaNo) {
      query += ` AND v."ayaNo" = $2`;
      bindValues.push(ayaNo);
    }

    if (suraNo) {
      query += ayaNo ? ` AND v."suraNo" = $3` : ` AND v."suraNo" = $2`;
      bindValues.push(suraNo);
    }

    // Append the GROUP BY clause to the query
    query += `
      GROUP BY 
          q."conceptNameAr",
          q."conceptNameEn",
          v."emlaeyTextNoDiacritics",
          v."suraNo", 
          v."ayaNo", 
          v."suraNameAr", 
          v."suraNameEn",
          v."uthmaniTextDiacritics", 
          v."englishTranslation"
    `;

    // Execute the query with the dynamically constructed bind values
    const results = await sequelize.query(query, {
      bind: bindValues,
      type: Sequelize.QueryTypes.SELECT,
    });

    return results;
  } catch (error) {
    logger.error('Error fetching Sura Aya Info:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Query did not execute`);
  }
};

module.exports = {
  getQuranaDataBasedOnConcept,
};
