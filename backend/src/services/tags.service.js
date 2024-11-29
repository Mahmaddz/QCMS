const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const { Tags } = require('../models');
const ApiError = require('../utils/ApiError');

const addTagsToTheVerses = async (suraNo, verseNo, wordNo, segment, source, statusId, en, ar, type, actionId) => {
  try {
    await Tags.create({
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

    const [updatedRowCount, updatedRows] = await Tags.update(
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
    const deletedRowCount = await Tags.destroy({
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
    const [updatedRowCount] = await Tags.update(
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

module.exports = {
  addTagsToTheVerses,
  updateTagsRowUsingTagId,
  deleteTagUsingTagId,
  changeTagsStatsusUsingId,
};
