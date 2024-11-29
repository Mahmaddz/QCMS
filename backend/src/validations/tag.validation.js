const Joi = require('joi');

const addTag = {
  body: Joi.object().keys({
    suraNo: Joi.number().required(),
    verseNo: Joi.number().required(),
    wordId: Joi.number().required(),
    segmentId: Joi.number().required(),
    source: Joi.string().required(),
    statusId: Joi.number().required(),
    en: Joi.number().required(),
    ar: Joi.number().required(),
    type: Joi.number().required(),
    actionId: Joi.number().required(),
  }),
};

const updateTag = {
  body: Joi.object().keys({
    tagId: Joi.number().required(),
    suraNo: Joi.number().required(),
    verseNo: Joi.number().required(),
    wordId: Joi.number().required(),
    segmentId: Joi.number().required(),
    statusId: Joi.number().required(),
    en: Joi.number().required(),
    ar: Joi.number().required(),
    type: Joi.number().required(),
    actionId: Joi.number().required(),
  }),
};

const deleteTag = {
  body: Joi.object().keys({
    tagId: Joi.number().required(),
    suraNo: Joi.number().optional(),
    verseNo: Joi.number().optional(),
    wordId: Joi.number().optional(),
    segmentId: Joi.number().optional(),
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
