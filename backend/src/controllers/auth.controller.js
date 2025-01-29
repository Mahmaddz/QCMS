/* eslint-disable no-console */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiError = require('../utils/ApiError');
const { generateRandomString } = require('../utils/utilFunc');
const { logger } = require('../config/logger');
const { baseUrl } = require('../constant/baseUrl');

const register = catchAsync(async (req, res) => {
  const { password, confirmPassword } = req.body;
  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (password !== confirmPassword) throw new ApiError(httpStatus.CONFLICT, 'Password and Confirm Password must be same');
  const user = await userService.createUser(req.body);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  logger.info(`${baseUrl}/v1/auth/verify-email?token=${verifyEmailToken}`);
  // await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  return res.status(httpStatus.CREATED).send({ success: true, message: 'User Created' });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  return res.send({ success: true, user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  // const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    throw new ApiError(httpStatus.CONFLICT, `Email does not exist`);
  }

  const newPassword = generateRandomString(13);
  console.log(newPassword);
  await userService.updatePassword(user.id, newPassword);
  // await emailService.sendEmail(req.body.email, `Forgot Password`, `Your new password is ${newPassword}`);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Password Updated',
  });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                display: inline-block;
            }
            h1 {
                color: #4CAF50;
            }
            p {
                font-size: 18px;
            }
            a {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                text-decoration: none;
                background-color: #4CAF50;
                color: white;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Email Verified Successfully 🎉</h1>
            <p>Your email has been successfully verified. You can now log in.</p>
            <a href="/">Go to Homepage</a>
        </div>
    </body>
    </html>
  `);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
