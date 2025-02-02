/* eslint-disable no-console */
const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const { Tag, Op, Sequelize, Status, Action, Verse, Users } = require('../models');
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
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateTagsRowUsingTagId = async (id, suraNo, ayaNo, category, arabic, userId) => {
  try {
    const previousRow = await Tag.findOne({
      where: { id, suraNo, ayaNo },
    });
    const [updatedRowCount] = await Tag.update(
      {
        category,
        arabic,
        actionId: 3,
        userId,
        statusId: 1,
        ...(previousRow.dataValues.statusId === 2 && {
          categoryOld: previousRow.dataValues.category,
          arabicOld: previousRow.dataValues.arabic,
        }),
      },
      {
        where: { id, suraNo, ayaNo },
      }
    );
    if (updatedRowCount === 0) {
      return { success: false, message: `No tag found with id ${id} to update.` };
    }
    return { success: true, message: `Tag at ${suraNo}:${ayaNo} updated successfully.` };
  } catch (error) {
    logger.error(`Error updating tag: ${error.message}`);
    throw new ApiError(httpStatus.CONFLICT, error.message);
  }
};

const deleteTagUsingTagId = async (tagId, userId, forceDelete = false) => {
  try {
    const [updatedCount] = await Tag.update(
      { actionId: 2, userId, statusId: 1 },
      {
        where: { id: tagId },
      }
    );
    if (updatedCount > 0 && forceDelete) {
      await Tag.destroy({
        where: { id: tagId },
        force: true,
      });
    }
    return updatedCount > 0;
  } catch (error) {
    logger.error(`Error deleting tag: ${error.message}`);
    throw new ApiError(httpStatus.CONFLICT, error.message);
  }
};

const changeTagsStatsusUsingId = async (tagId, statusId) => {
  try {
    let updatedRowCount = 0;

    const previousRow = await Tag.findOne({
      where: { id: tagId },
    });

    const { actionId, categoryOld, arabicOld } = previousRow.dataValues;

    if (actionId === 3 && statusId === 3) {
      const [URC] = await Tag.update(
        {
          statusId: 2,
          category: categoryOld,
          arabic: arabicOld,
        },
        {
          where: { id: tagId },
        }
      );
      updatedRowCount = URC;
    }

    if (statusId === 2 || (statusId === 3 && actionId !== 3)) {
      const [URC] = await Tag.update(
        {
          statusId,
        },
        {
          where: { id: tagId },
        }
      );
      updatedRowCount = URC;
    }

    if (updatedRowCount === 0) {
      return { message: `No tag found with ID ${tagId} to Update.`, success: false };
    }

    return { message: `Tag's Status Updated.`, success: true };
  } catch (error) {
    logger.error(`Error deleting tag: ${error.message}`);
    throw new ApiError(httpStatus.CONFLICT, error.message);
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
      ...(ayaNo ? { ayaNo } : { ayaNo: { [Op.ne]: 0 } }),
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
      statusId: 2,
    },
    order: [
      ['suraNo', 'ASC'],
      ['ayaNo', 'ASC'],
      ['id', 'ASC'],
    ],
  });
  return result.map((r) => r.dataValues);
};

const listOfSubmittedTags = async () => {
  const result = await Tag.findAll({
    attributes: [
      'id',
      'suraNo',
      'ayaNo',
      'categoryOld',
      'arabicOld',
      [Sequelize.col('user.username'), 'username'],
      [Sequelize.col('category'), 'en'],
      [Sequelize.col('arabic'), 'ar'],
      [Sequelize.col('action.actionDef'), 'actions'],
      [Sequelize.col('status.statusDef'), 'statuses'],
      [Sequelize.fn('MAX', Sequelize.col('verseBySura.emlaeyTextDiacritics')), 'ayaText'],
    ],
    include: [
      {
        model: Action,
        as: 'action',
        attributes: [],
      },
      {
        model: Users,
        as: 'user',
        attributes: [],
      },
      {
        model: Status,
        as: 'status',
        attributes: [],
      },
      {
        model: Verse,
        as: 'verseBySura',
        attributes: [],
      },
      {
        model: Verse,
        as: 'verseByAya',
        attributes: [],
      },
    ],
    where: {
      statusId: 1,
    },
    group: ['Tag.id', 'action.id', 'status.id', 'user.id', 'user.username'],
    order: [['id', 'DESC']],
    paranoid: false,
  });
  return result.map((item) => item.get({ plain: true }));
};

module.exports = {
  addTagsToTheVerses,
  updateTagsRowUsingTagId,
  deleteTagUsingTagId,
  changeTagsStatsusUsingId,
  suraAndAyaByTagMatch,
  tagsRelatedToSurahAndAyah,
  listOfSubmittedTags,
};
