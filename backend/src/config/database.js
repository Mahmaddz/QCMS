const { pgDB } = require('./config');

const { host, name, pswd, user } = pgDB.vars;

module.exports = {
  development: {
    username: user,
    password: pswd,
    database: name,
    host,
    dialect: 'postgres',
  },
  test: {
    username: user,
    password: pswd,
    database: name,
    host,
    dialect: 'postgres',
  },
  production: {
    username: user,
    password: pswd,
    database: name,
    host,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
