/* eslint-disable no-console */
const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const { Comment, Users, Sequelize } = require('../models');
const ApiError = require('../utils/ApiError');

const insertComment = async (suraNo, ayaNo, commentText, userId, commentType, tagId) => {
  try {
    const insertedComment = await Comment.create({
      suraNo,
      ayaNo,
      commentText,
      userId,
      commentType,
      tagId,
    });
    return insertedComment.dataValues.id;
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getComments = async (suraNo, ayaNo, tagId) => {
  try {
    const result = await Comment.findAll({
      attributes: [
        'id',
        'suraNo',
        'ayaNo',
        'commentText',
        'commentType',
        'userId',
        'createdAt',
        'updatedAt',
        [Sequelize.col('user.username'), 'username'],
      ],
      where: { suraNo, ayaNo, tagId },
      include: [
        {
          model: Users,
          as: 'user',
          attributes: [],
        },
      ],
      order: [
        ['createdAt', 'ASC'],
        ['updatedAt', 'ASC'],
      ],
    });
    return result.map((item) => item.dataValues);
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const editComment = async (id, suraNo, ayaNo, commentText, tagId) => {
  try {
    const [updatedRows] = await Comment.update({ commentText }, { where: { id, suraNo, ayaNo, tagId } });
    return updatedRows > 0;
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteComment = async (id) => {
  try {
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      throw new ApiError(httpStatus.NOT_FOUND, `Comment ID: ${id} not found`);
    }
    const { suraNo, ayaNo } = comment;
    await Comment.destroy({ where: { id } });
    return { suraNo, ayaNo };
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
