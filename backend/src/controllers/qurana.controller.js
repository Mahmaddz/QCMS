const { quranaServices } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getQuaraInfo = catchAsync(async (req, res) => {
  const results = await quranaServices.getQuranaDataBasedOnConcept(
    req.query.concept,
    Number.parseInt(req.query.ayaNo, 10),
    Number.parseInt(req.query.suraNo, 10)
  );
  res.status(200).json({
    success: true,
    data: results,
  });
});

module.exports = {
  getQuaraInfo,
};
