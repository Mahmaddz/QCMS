/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tagsServices } = require('../services');
const ApiError = require('../utils/ApiError');

const addTag = catchAsync(async (req, res) => {
  const { suraNo, verseNo, en, ar } = req.body;
  const userID = req.user.id;
  if (!userID) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, `User ID required`);
  }
  const insertedTagId = await tagsServices.addTagsToTheVerses(suraNo, verseNo, en, ar, userID);
  return res.status(httpStatus.OK).json({
    success: true,
    insertedTagId,
    message: `TAGS SUCCESSFULLY INSERTED`,
  });
});

const deleteTag = catchAsync(async (req, res) => {
  const { tagId } = req.body;
  const userID = req.user.id;
  const role = req.user.roleID;
  if (!role) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Role Not Found`);
  }
  const isDeleted = await tagsServices.deleteTagUsingTagId(tagId, role, userID);
  return res.status(isDeleted ? httpStatus.OK : httpStatus.NOT_FOUND).json({
    success: true,
    message: isDeleted ? `TagId: ${tagId} deleted successfully` : `TagId: ${tagId} 404`,
  });
});

const updateTag = catchAsync(async (req, res) => {
  const { tagId, suraNo, ayaNo, en, ar } = req.body;
  const reposne = await tagsServices.updateTagsRowUsingTagId(tagId, suraNo, ayaNo, en, ar);
  return res.status(httpStatus.OK).json(reposne);
});

const changeTagStatus = catchAsync(async (req, res) => {
  const { tagId, statusId } = req.body;
  const response = await tagsServices.changeTagsStatsusUsingId(tagId, statusId);
  return res.status(httpStatus.OK).json(response);
});

module.exports = {
  addTag,
  deleteTag,
  updateTag,
  changeTagStatus,
};
