const Joi = require('joi');

const addTag = {
  body: Joi.object().keys({
    suraNo: Joi.number().required(),
    verseNo: Joi.number().required(),
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }),
};

const updateTag = {
  body: Joi.object().keys({
    tagId: Joi.number().required(),
    suraNo: Joi.number().required(),
    ayaNo: Joi.number().required(),
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }),
};

const deleteTag = {
  body: Joi.object().keys({
    tagId: Joi.number().required(),
  }),
};

const changeTagStatus = {
  body: Joi.object().keys({
    tagId: Joi.number().required(),
    suraNo: Joi.number().optional(),
    verseNo: Joi.number().optional(),
    wordId: Joi.number().optional(),
    segmentId: Joi.number().optional(),
    statusId: Joi.number().required(),
  }),
};

module.exports = {
  addTag,
  updateTag,
  changeTagStatus,
  deleteTag,
};
