const httpStatus = require('http-status');
const { logger } = require('../config/logger');
// const { Sequelize, Op, Comment } = require('../models');
const ApiError = require('../utils/ApiError');

const insertComment = async (suraNo, ayaNo, text) => {
  try {
    logger.info(suraNo, ayaNo, text);
    return 2;
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getComments = async (suraNo, ayaNo) => {
  try {
    logger.info(suraNo, ayaNo);
    return [{ userId: 1, commentText: 'nofil' }];
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const editComment = async (suraNo, ayaNo, text) => {
  try {
    logger.info(suraNo, ayaNo, text);
    return true;
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteComment = async (id) => {
  try {
    logger.info(id);
    return { suraNo: 1, ayaNo: 1 };
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  insertComment,
  getComments,
  editComment,
  deleteComment,
};
