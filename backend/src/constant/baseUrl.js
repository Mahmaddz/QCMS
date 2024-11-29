const config = require('../config/config');

const baseUrlArray = [`http://localhost:${config.port}`];

module.exports = {
  baseUrl: baseUrlArray[0],
};
