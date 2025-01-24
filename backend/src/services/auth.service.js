/* eslint-disable no-console */
const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
// const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { logger } = require('../config/logger');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
// eslint-disable-next-line no-unused-vars
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmailWithRole(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email is not verified yet');
  }
  if (user.roleID === 3) {
    throw new ApiError(httpStatus.TEMPORARY_REDIRECT, `YOU CANNOT LOG IN`);
  }
  const userData = user.dataValues;
  delete userData.password;
  delete userData.isEmailVerified;
  return userData;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (userId) => {
  const tokens = await tokenService.deleteTokenByUserId(userId);
  if (!tokens) {
    logger.info('No Tokens Found');
    return false;
  }
  return true;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    console.log('refreshTokenDoc =>', refreshTokenDoc);
    const user = await userService.getUserByIdWithRole(refreshTokenDoc.user.id);
    if (!user) {
      throw new Error();
    }
    // delete user.password;
    user.password = undefined;
    // await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (userId, currentPassword, newPassword) => {
  console.log('Attempting to reset password:', { userId, currentPassword, newPassword });

  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User not found`);
  }

  const isMatch = await user.isPasswordMatch(currentPassword);
  if (!isMatch) {
    throw new ApiError(httpStatus.CONFLICT, `Current Password does not match`);
  }

  if (currentPassword === newPassword) {
    throw new ApiError(httpStatus.CONFLICT, `Current Password cannot be the new password`);
  }

  const [updatedRowsCount] = await userService.updatePassword(userId, newPassword);
  console.log('Password update result:', updatedRowsCount);

  if (updatedRowsCount === 0) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to update password`);
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    console.log(verifyEmailTokenDoc);
    const user = await userService.getUserById(verifyEmailTokenDoc.user.id);
    console.log(user);
    if (!user) {
      throw new Error();
    }
    await tokenService.deleteToken(user.id);
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
