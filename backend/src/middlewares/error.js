const httpStatus = require('http-status');
const { ValidationError, DatabaseError } = require('sequelize');
const config = require('../config/config');
const { logger } = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode;
    if (error instanceof ValidationError) {
      statusCode = httpStatus.BAD_REQUEST;
      error.message = error.errors.map((e) => e.message).join(', ');
    } else if (error instanceof DatabaseError) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    } else {
      statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    }

    error = new ApiError(statusCode, error.message || httpStatus[statusCode], false, err.stack);
  }

  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    isError: true,
    error: {
      message,
      code: statusCode,
    },
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
