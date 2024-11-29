/* eslint-disable no-console */
const { default: axios } = require('axios');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

// data => 'يُشار إلى أن اللغة العربية'
const getLemo = async (data) => {
  try {
    const response = await axios.post('https://farasa.qcri.org/webapi/lemmatization/', {
      text: data,
      api_key: `${config.external.farasaApiKey}`,
    });
    // THIS WILL RETURN ONLY FIRST THREE LETTERS OF THE LEMMA
    return response.data.text.map((txt) => txt.slice(0, 3).split('').join(' '));
  } catch (error) {
    throw new ApiError(error.status, `[LEMONIZATION]: ${error.response.data}`);
  }
};

const getRoot = async (data) => {
  try {
    const response = await axios.post(`http://oujda-nlp-team.net:8080/api/Racine`, `textinput=${data}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const words = response.data.split(' ');
    const formattedWords = words.map((word) => word.split('').join(''));
    return formattedWords;
  } catch (error) {
    throw new ApiError(error.status, `[Root]: ${error.response.data}`);
  }
};

module.exports = {
  getLemo,
  getRoot,
};
