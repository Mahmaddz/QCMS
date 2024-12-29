const { Sphinxql } = require('sphinxql');
const { sphinx } = require('./config');

const sphql = Sphinxql.createPoolConnection({
  host: sphinx.host,
  port: sphinx.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: false,
});

module.exports = sphql;
