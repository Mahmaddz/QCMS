const { Language, Translator } = require('../models');

const getCompleteListOfLanguagesNameOnly = async () => {
  const result = await Translator.findAll({
    attributes: ['id', 'authorName'],
    include: [
      {
        model: Language,
        as: 'language',
        attributes: ['id', 'name', 'code'],
        required: true,
      },
    ],
  });
  return result.map((item) => item.dataValues);
};

module.exports = {
  getCompleteListOfLanguagesNameOnly,
};
