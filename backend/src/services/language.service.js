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
    raw: true,
    nest: true,
  });
  return [{ id: 0, authorName: 'none', language: { id: 0, code: '', name: '' } }].concat(result);
};

module.exports = {
  getCompleteListOfLanguagesNameOnly,
};
