/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');
const { logger } = require('../config/logger');

const createDirectory = (absolutePath) => {
  if (!fs.existsSync(absolutePath)) {
    logger.info('Directory Created => ', absolutePath);
    fs.mkdirSync(absolutePath, {
      recursive: true,
    });
  }
};

module.exports = {
  createDirectory,
};
