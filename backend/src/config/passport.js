/* eslint-disable no-console */
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const httpStatus = require('http-status');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await userService.getUserByIdWithRole(payload.sub.id);
    if (user.role.roleName !== payload.sub.role.roleName) {
      throw new ApiError(httpStatus.TEMPORARY_REDIRECT, `You're not allowed to login`);
    }
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
