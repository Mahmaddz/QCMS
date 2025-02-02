const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { commentServices } = require('../services');
const ApiError = require('../utils/ApiError');

const addComment = catchAsync(async (req, res) => {
  const { suraNo, ayaNo, text, tagId } = req.body;
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, `UserId not Found`);
  }
  const insertedCommentId = await commentServices.insertComment(suraNo, ayaNo, text, userId, tagId);
  return res.status(httpStatus.OK).json({
    success: true,
    insertedCommentId,
    message: `Comment added (${suraNo}:${ayaNo})`,
  });
});

const getComments = catchAsync(async (req, res) => {
  const { suraNo, ayaNo, tagId } = req.query;
  const data = await commentServices.getComments(suraNo, ayaNo, tagId);
  return res.status(httpStatus.OK).json({
    success: true,
    data,
    message: data.length > 0 ? 'Comments Loaded' : 'No Comments Found',
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id, suraNo, ayaNo, text, tagId } = req.body;
  const isEdited = await commentServices.editComment(id, suraNo, ayaNo, text, tagId);
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
    message: `Comment deleted (${suraNo}:${ayaNo}) successfully`,
  });
});

module.exports = {
  addComment,
  getComments,
  updateComment,
  removeComment,
};
