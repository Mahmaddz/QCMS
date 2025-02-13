const httpStatus = require('http-status');
const { Translator } = require('../models');
const ApiError = require('../utils/ApiError');
const { logger } = require('../config/logger');

const addAuthorInfo = async (langId, authorName) => {
  try {
    const insertedAuthor = await Translator.create({
      langId: parseInt(langId, 10),
      authorName,
    });
    return insertedAuthor.dataValues;
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.BAD_GATEWAY, error.message);
  }
};

module.exports = {
  addAuthorInfo,
};
