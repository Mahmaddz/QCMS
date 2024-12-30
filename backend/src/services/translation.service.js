const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const { Translation, Language } = require('../models');
const ApiError = require('../utils/ApiError');

const getSuraTranslations = async (suraNo, ayaNo = undefined) => {
  try {
    const result = await Translation.findAll({
      attributes: ['sura', 'aya', 'text'],
      include: [
        {
          model: Language,
          as: 'language',
          attributes: ['name', 'code'],
          required: true,
        },
      ],
      where: {
        sura: suraNo,
        ...(ayaNo && { aya: ayaNo }),
      },
      order: [
        ['lang_id', 'ASC'],
        ['sura', 'ASC'],
        ['aya', 'ASC'],
      ],
    });
    return result.map((translation) => {
      return {
        sura: translation.sura,
        aya: translation.aya,
        text: translation.text,
        language: translation.language.dataValues,
      };
    });
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `getSuraTranslations failed`);
  }
};

module.exports = {
  getSuraTranslations,
};
