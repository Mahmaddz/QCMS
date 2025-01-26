const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { commentServices } = require('../services');

const addComment = catchAsync(async (req, res) => {
  const { suraNo, ayaNo, text } = req.body;
  const insertedCommentId = await commentServices.insertComment(suraNo, ayaNo, text);
  return res.status(httpStatus.OK).json({
    success: true,
    insertedCommentId,
    message: `Comment added @ ${suraNo}:${ayaNo}`,
  });
});

const getComments = catchAsync(async (req, res) => {
  const { suraNo, ayaNo } = req.query;
  const data = await commentServices.getComments(suraNo, ayaNo);
  return res.status(httpStatus.OK).json({
    success: true,
    data,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { suraNo, ayaNo, text } = req.body;
  const isEdited = await commentServices.editComment(suraNo, ayaNo, text);
  return res.status(httpStatus.OK).json({
    success: true,
    message: isEdited ? 'Comment Edited' : 'Comment Not Found',
  });
});

const removeComment = catchAsync(async (req, res) => {
  const { id } = req.body;
  const { suraNo, ayaNo } = await commentServices.deleteComment(id);
  return res.status(httpStatus.OK).json({
    success: true,
    message: `Comment deleted @ ${suraNo}:${ayaNo}`,
  });
});

module.exports = {
  addComment,
  getComments,
  updateComment,
  removeComment,
};