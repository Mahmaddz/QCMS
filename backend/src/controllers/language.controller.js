const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { languageServices } = require('../services');

const getListOfLanguages = catchAsync(async (req, res) => {
  const data = await languageServices.getCompleteListOfLanguagesNameOnly();
  return res.status(httpStatus.OK).json({
    success: true,
    data,
  });
});

module.exports = {
  getListOfLanguages,
};
