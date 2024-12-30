const { Language } = require('../models');

const getCompleteListOfLanguagesNameOnly = async () => {
  const result = await Language.findAll({
    attributes: ['id', 'name', 'code'],
  });
  return result.map((item) => item.dataValues);
};

module.exports = {
  getCompleteListOfLanguagesNameOnly,
};
