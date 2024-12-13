/* eslint-disable no-console */
const { default: axios } = require('axios');
const { ArabicServices } = require('arabic-services');
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
    return response.data.text; // .map((txt) => txt.slice(0, 3).split('').join(' '));
  } catch (error) {
    throw new ApiError(error.status, `[LEMONIZATION]: ${error.response.data}`);
  }
};

const getLemmaUsingAlKhalil = async (data) => {
  try {
    const response = await axios.post(`http://oujda-nlp-team.net:8080/api/lemma`, `textinput=${data}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return ArabicServices.removeTashkeel(response.data).split(' ');
  } catch (error) {
    throw new ApiError(error.status, `[Root]: ${error.response.data}`);
  }
};

const getRootUsingAlKhalil = async (data) => {
  try {
    const response = await axios.post(`http://oujda-nlp-team.net:8080/api/Racine`, `textinput=${data}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data.split(' ');
  } catch (error) {
    throw new ApiError(error.status, `[Root]: ${error.response.data}`);
  }
};

module.exports = {
  getLemo,
  getLemmaUsingAlKhalil,
  getRootUsingAlKhalil,
};
