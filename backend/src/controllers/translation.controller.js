const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { logger } = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { translatorServices, translationServices } = require('../services');

const uploadTranslation = catchAsync(async (req, res) => {
  if (!req.file) {
    logger.info('File Not Found');
    throw new ApiError(httpStatus.NOT_FOUND, 'File Not Found');
  }

  const quranLanguageTranslation = JSON.parse(req.file.buffer);
  const { langId, authorName } = req.params;

  if (quranLanguageTranslation.length === 0) {
    logger.error('File Is Empty');
    throw new ApiError(httpStatus.BAD_REQUEST, 'File Is Empty');
  }

  if (authorName.includes(' ')) {
    logger.error('Space Not Allowed In Author Name');
    throw new ApiError(httpStatus.BAD_REQUEST, 'Space Not Allowed In Author Name');
  }

  const insertedTranslator = await translatorServices.addAuthorInfo(langId, authorName);
  const result = await translationServices.insertLanguageTranslation(quranLanguageTranslation, insertedTranslator.id);

  return res.status(httpStatus.OK).json({
    success: true,
    langId,
    authorName,
    message: result ? 'Translation Inserted' : 'Translation Not Inserted',
  });
});

module.exports = {
  uploadTranslation,
};
