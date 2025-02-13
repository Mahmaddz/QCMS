const Joi = require('joi');

const upload = {
  params: Joi.object().keys({
    langId: Joi.number().required(),
    authorName: Joi.string().required(),
  }),
  file: Joi.object({
    mimetype: Joi.string()
      .valid('text/csv', 'application/vnd.ms-excel', 'application/json')
      .required()
      .messages({ 'any.only': 'File must be a CSV, XLS, or JSON file' }),
    size: Joi.number()
      .max(2 * 1024 * 1024)
      .messages({
        'number.max': 'File size must be less than 2 MB',
      }),
    originalname: Joi.string()
      .pattern(/\.(csv|xls|json)$/)
      .required()
      .messages({
        'string.pattern.base': 'File extension must be .csv, .xls, or .json',
      }),
  }),
};

module.exports = {
  upload,
};
