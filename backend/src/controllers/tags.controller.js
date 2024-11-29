/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tagsServices } = require('../services');

const addTag = catchAsync(async (req, res) => {
  const { suraNo, verseNo, wordId, segmentId, source, statusId, en, ar, type, actionId } = req.body;
  await tagsServices.addTagsToTheVerses(suraNo, verseNo, wordId, segmentId, source, statusId, en, ar, type, actionId);
  return res.status(httpStatus.OK).json({
    success: true,
    message: `TAGS SUCCESSFULLY INSERTED`,
  });
});

const deleteTag = catchAsync(async (req, res) => {
  const { tagId } = req.body;
  await tagsServices.deleteTagUsingTagId(tagId);
  return res.status(httpStatus.OK).json({
    success: true,
    message: ``,
  });
});

const updateTag = catchAsync(async (req, res) => {
  const { tagId } = req.body;
  await tagsServices.updateTagsRowUsingTagId(tagId);
  return res.status(httpStatus.OK).json({
    success: true,
    message: `TagID: ${tagId}, Updated Successfully`,
  });
});

const changeTagStatus = catchAsync(async (req, res) => {
  const { tagId, statusId } = req.body;
  tagsServices.changeTagsStatsusUsingId(tagId, statusId);
  return res.status(httpStatus.OK).json({
    success: true,
    message: ``,
  });
});

module.exports = {
  addTag,
  deleteTag,
  updateTag,
  changeTagStatus,
};
