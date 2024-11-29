const Joi = require('joi');

const getQuranaInfo = {
  query: Joi.object().keys({
    concept: Joi.string().required(),
    ayaNo: Joi.string().optional(),
    suraNo: Joi.string().optional(),
  }),
};

module.exports = {
  getQuranaInfo,
};
