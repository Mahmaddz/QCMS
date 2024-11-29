/* eslint-disable no-console */
const { Sequelize, Transaction } = require('sequelize');
const { createNamespace } = require('cls-hooked');
const { logger } = require('./logger');
const config = require('./config');

const namespace = createNamespace('my-namespace');
Sequelize.useCLS(namespace);

const PG_CONNECTION_URL = config.env === 'development' ? `${config.pgDB.url}` : `${config.pgDB.url}?sslmode=require`;
const sequelize = new Sequelize(`${PG_CONNECTION_URL}`, {
  dialect: 'postgres',
  logging: config.env === '1development' ? console.log : false,
  isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      connectTimeout: 60000,
    },
  },
  // individualHooks: true,
});

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('[Sequelize] : Connection has been established successfully.');
  } catch (error) {
    logger.warn('[Sequelize] : Unable to connect to the database:', error);
    process.exit(1);
  }
})();

module.exports = sequelize;
