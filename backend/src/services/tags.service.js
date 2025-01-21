const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const { Tag, Op, Sequelize } = require('../models');
const ApiError = require('../utils/ApiError');

const addTagsToTheVerses = async (suraNo, verseNo, wordNo, segment, source, statusId, en, ar, type, actionId) => {
  try {
    await Tag.create({
      suraNo,
      verseNo,
      wordNo,
      segment,
      source,
      statusId,
      en,
      ar,
      type,
      actionId,
    });
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Insert Query Issue`);
  }
};

const updateTagsRowUsingTagId = async (tagId, suraNo, verseNo, wordNo, segment, en, ar, type, actionId) => {
  try {
    logger.debug(tagId, suraNo, verseNo, wordNo, segment, en, ar, type, actionId);

    const [updatedRowCount, updatedRows] = await Tag.update(
      {
        suraNo,
        verseNo,
        wordNo,
        segment,
        en,
        ar,
        type,
        actionId,
      },
      {
        where: { id: tagId },
        returning: true,
      }
    );

    if (updatedRowCount === 0) {
      logger.warn(`No tag found with id ${tagId} to update.`);
      return null;
    }

    logger.info(`Tag with id ${tagId} updated successfully.`);
    return updatedRows;
  } catch (error) {
    logger.error(`Error updating tag: ${error.message}`);
    throw new ApiError(httpStatus.CONFLICT, `ISSUE IN UPDATING VALUES`);
  }
};

const deleteTagUsingTagId = async (tagId) => {
  try {
    const deletedRowCount = await Tag.destroy({
      where: { id: tagId },
    });

    if (deletedRowCount === 0) {
      logger.warn(`No tag found with ID ${tagId} to delete.`);
    }
  } catch (error) {
    logger.error(`Error deleting tag: ${error.message}`);
    throw new ApiError(httpStatus.CONFLICT, `ISSUE IN DELETING VALUES`);
  }
};

const changeTagsStatsusUsingId = async (tagId, statusId) => {
  try {
    const [updatedRowCount] = await Tag.update(
      {
        statusId,
      },
      {
        where: { id: tagId },
        returning: true,
      }
    );
    if (updatedRowCount === 0) {
      logger.warn(`No tag found with ID ${tagId} to delete.`);
    }
  } catch (error) {
    logger.error(`Error deleting tag: ${error.message}`);
    throw new ApiError(httpStatus.CONFLICT, `ISSUE IN DELETING VALUES`);
  }
};

const suraAndAyaByTagMatch = async (term, suraNo = undefined, ayaNo = undefined) => {
  if (!term || term.trim() === '') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Search term cannot be empty');
  }

  // eslint-disable-next-line no-nested-ternary
  const column = /[a-zA-Z]/.test(term) ? 'category' : /[\u0600-\u06FF]/.test(term) ? 'arabic' : null;
  if (!column) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Language not detected');
  }

  const result = await Tag.findAll({
    attributes: ['suraNo', 'ayaNo', [Sequelize.col('category'), 'en'], [Sequelize.col('arabic'), 'ar']],
    where: {
      [column]: {
        [Op.iLike]: { [Op.any]: term.split(' ').map((t) => `%${t}%`) },
      },
      ...(suraNo && { suraNo }),
      ...(ayaNo
        ? {
            ayaNo,
          }
        : {
            ayaNo: {
              [Op.ne]: 0,
            },
          }),
    },
    order: [
      ['suraNo', 'ASC'],
      ['ayaNo', 'ASC'],
    ],
  });
  return result;
};

module.exports = {
  addTagsToTheVerses,
  updateTagsRowUsingTagId,
  deleteTagUsingTagId,
  changeTagsStatsusUsingId,
  suraAndAyaByTagMatch,
};
