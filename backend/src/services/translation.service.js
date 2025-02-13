const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const { Translation } = require('../models');
const ApiError = require('../utils/ApiError');
const fileServices = require('./file.service');

const getSuraTranslations = async (suraNo, ayaNo = undefined) => {
  try {
    const result = await Translation.findAll({
      attributes: ['sura', 'aya', 'text', 'translatorId'],
      // include: [
      //   {
      //     model: Translator,
      //     as: 'translator',
      //     attributes: ['id'],
      //     required: true,
      //   },
      // ],
      where: {
        sura: suraNo,
        ...(ayaNo && { aya: ayaNo }),
      },
      order: [
        // ['lang_id', 'ASC'],
        ['sura', 'ASC'],
        ['aya', 'ASC'],
      ],
    });
    return result;
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const insertLanguageTranslation = async (data, translatorId) => {
  const mappedData = data.map((item) => ({
    sura: item.sura,
    aya: item.aya,
    text: item.text,
    translatorId,
  }));
  const isInsertedSuccessfully = await fileServices.insertInBatches(Translation, mappedData);
  return isInsertedSuccessfully;
};

module.exports = {
  getSuraTranslations,
  insertLanguageTranslation,
};
