const Joi = require('joi');

const addComment = {
  body: Joi.object().keys({
    suraNo: Joi.number().required(),
    ayaNo: Joi.number().required(),
    text: Joi.string().required(),
    tagId: Joi.number().required(),
  }),
};

const getComment = {
  query: Joi.object().keys({
    suraNo: Joi.number().required(),
    ayaNo: Joi.number().required(),
    tagId: Joi.number().required(),
  }),
};

const editComment = {
  body: Joi.object().keys({
    id: Joi.number().required(),
    suraNo: Joi.number().required(),
    ayaNo: Joi.number().required(),
    text: Joi.string().required(),
    tagId: Joi.number().required(),
  }),
};

const deleteComment = {
  body: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = {
  addComment,
  getComment,
  editComment,
  deleteComment,
};
