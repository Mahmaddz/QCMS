const Joi = require('joi');

const uploadValidation = {
  param: Joi.object().keys({
    fileNature: Joi.string().valid('verses', 'tags').required(),
  }),
  file: Joi.object({
    mimetype: Joi.string()
      .valid('text/csv', 'application/vnd.ms-excel', 'text/plain')
      .required()
      .messages({ 'any.only': 'File must be a CSV, XLS, or TXT file' }),
    size: Joi.number()
      .max(2 * 1024 * 1024) // Max file size of 2 MB
      .messages({
        'number.max': 'File size must be less than 2 MB',
      }),
    originalname: Joi.string()
      .pattern(/\.(csv|xls|txt)$/)
      .required()
      .messages({
        'string.pattern.base': 'File extension must be .csv, .xls, or .txt',
      }),
  }),
};

module.exports = {
  uploadValidation,
};
