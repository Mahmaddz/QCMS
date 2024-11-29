const Joi = require('joi');

const getAyaWordsValidation = {
  query: Joi.object().keys({
    suraNo: Joi.string().required(),
    ayaNo: Joi.string().required(),
  }),
};

module.exports = {
  getAyaWordsValidation,
};
