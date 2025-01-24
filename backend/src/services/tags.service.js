/* eslint-disable no-console */
const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const { Tag, Op, Sequelize } = require('../models');
const ApiError = require('../utils/ApiError');

const addTagsToTheVerses = async (suraNo, ayaNo, category, arabic, userId) => {
  try {
    const insertedTag = await Tag.create({
      suraNo,
      ayaNo,
      category,
      arabic,
      actionId: 1,
      statusId: 1,
      userId,
    });
    return insertedTag.dataValues.id;
  } catch (error) {
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Tag Insert Query Issue`);
  }
};

const updateTagsRowUsingTagId = async (id, suraNo, ayaNo, category, arabic, userId) => {
  try {
    const [updatedRowCount] = await Tag.update(
      { category, arabic, actionId: 3, userId, statusId: 1 },
      {
        where: { id, suraNo, ayaNo },
      }
    );
    if (updatedRowCount === 0) {
      return { success: false, message: `No tag found with id ${id} to update.` };
    }
    return { success: true, message: `Tag with id ${id} updated successfully.` };
  } catch (error) {
    logger.error(`Error updating tag: ${error.message}`);
    throw new ApiError(httpStatus.CONFLICT, `ISSUE IN UPDATING VALUES`);
  }
};

const deleteTagUsingTagId = async (tagId, role, userId) => {
  try {
    const [updatedCount] = await Tag.update(
      { actionId: 2, userId, statusId: 1 },
      {
        where: { id: tagId },
      }
    );
    if (updatedCount > 0) {
      await Tag.destroy({
        where: { id: tagId },
        // ...(role === 1 && { force: true }),
      });
    }
    return updatedCount > 0;
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
      }
    );
    if (updatedRowCount === 0) {
      return { message: `No tag found with ID ${tagId} to Update.`, success: false };
    }
    return { message: `Tag's ${tagId} Status Updated To ${statusId}`, success: true };
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
    attributes: ['suraNo', 'ayaNo'],
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
      ['id', 'ASC'],
    ],
  });
  return result.map((r) => r.dataValues);
};

const tagsRelatedToSurahAndAyah = async (suraAyaList) => {
  const result = await Tag.findAll({
    attributes: ['id', 'suraNo', 'ayaNo', [Sequelize.col('category'), 'en'], [Sequelize.col('arabic'), 'ar']],
    where: {
      ...(suraAyaList[0].ayaNo
        ? { [Op.or]: suraAyaList.map(({ suraNo, ayaNo }) => ({ suraNo, ayaNo })) }
        : { suraNo: suraAyaList[0].suraNo }),
    },
    order: [
      ['suraNo', 'ASC'],
      ['ayaNo', 'ASC'],
      ['id', 'ASC'],
    ],
  });
  return result.map((r) => r.dataValues);
};

module.exports = {
  addTagsToTheVerses,
  updateTagsRowUsingTagId,
  deleteTagUsingTagId,
  changeTagsStatsusUsingId,
  suraAndAyaByTagMatch,
  tagsRelatedToSurahAndAyah,
};
