const { Sphinxql } = require('sphinxql');
const { sphinx } = require('./config');

const sphql = Sphinxql.createConnection({
  host: sphinx.host,
  port: sphinx.port,
});

module.exports = sphql;
