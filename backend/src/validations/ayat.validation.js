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
    surah: Joi.string().optional(),
    aya: Joi.string().optional(),
  }),
};

const surahAPIvalidation = {
  query: Joi.object().keys({
    suraNo: Joi.string().required(),
    ayaNo: Joi.string().optional(),
  }),
};

const ayahList = {
  body: Joi.object().keys({
    surahAyaList: Joi.array()
      .items(
        Joi.object({
          suraNo: Joi.number().required(),
          ayaNo: Joi.number().required(),
        })
      )
      .required(),
  }),
};

module.exports = {
  getAyaInfo,
  searchAya,
  surahAPIvalidation,
  ayahList,
};
