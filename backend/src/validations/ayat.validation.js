const Joi = require('joi');

const getAyaInfo = {
  query: Joi.object().keys({
    ayatText: Joi.string().required(),
    ayaNo: Joi.string().optional(),
    suraNo: Joi.string().optional(),
  }),
};

const searchAya = {
  query: Joi.object().keys({
    term: Joi.string().optional(),
    words: Joi.string().optional(),
  }),
};

const surahAPIvalidation = {
  query: Joi.object().keys({
    suraNo: Joi.string().required(),
    ayaNo: Joi.string().optional(),
  }),
};

module.exports = {
  getAyaInfo,
  searchAya,
  surahAPIvalidation,
};
