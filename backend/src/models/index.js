const fs = require('fs');
const path = require('path');
const { Sequelize, Op, col, literal, fn } = require('sequelize');
const sequelize = require('../config/sequelize');
const { logger } = require('../config/logger');

const db = {};

// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.js') && file !== 'index.js')
  .forEach((file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require, security/detect-non-literal-require
    const model = require(path.join(__dirname, file));
    if (typeof model === 'function') {
      db[model(sequelize, Sequelize.DataTypes).name] = model(sequelize, Sequelize.DataTypes);
    } else {
      logger.error(`Skipping file ${file} - not a valid Sequelize model`);
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

async function transaction(body) {
  try {
    return await sequelize.transaction(async (t) => {
      return body(t);
    });
  } catch (error) {
    logger.error('Transaction error:', error);
    throw error;
  }
}

db.Op = Op;
db.col = col;
db.fn = fn;
db.literal = literal;
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.transaction = transaction;

module.exports = db;
