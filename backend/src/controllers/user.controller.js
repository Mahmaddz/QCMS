const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService } = require('../services');
const { getUsersWithRoles } = require('../services/user.service');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const users = await getUsersWithRoles();
  const message = users.length > 0 ? 'DATA FOUND' : 'NOTHING FOUND';
  const status = users.length > 0 ? 200 : 404;
  return res.status(status).json({
    success: true,
    message,
    length: users.length,
    users,
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateUserRole = catchAsync(async (req, res) => {
  const { userId, newRole } = req.body;
  await userService.updateUserRoleByID(userId, newRole);
  await tokenService.blacklistUserToken(userId);
  return res.status(200).json({
    success: true,
    message: `${userId} is updated to new role.`,
  });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole,
};
