/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
const httpStatus = require('http-status');
const { logger } = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { fileServices } = require('../services');

const fileUpload = catchAsync(async (req, res) => {
  if (!req.file) {
    logger.info('File Not Found');
    throw new ApiError(httpStatus.NOT_FOUND, 'File Not Found');
  }

  if (req.params.fileNature === 'verses') {
    const workbook = await fileServices.readXlxsFile(req.file.buffer);
    const requiredModels = ['verses']; // ['verses', 'Qurana', 'khadija', 'Sample-index', 'mushaf+'];

    const successArr = [];

    for (const sheetName of workbook.SheetNames.filter((sn) => requiredModels.includes(sn))) {
      const sheet = workbook.Sheets[sheetName];
      const dataSet = await fileServices.getDataFromSheet(sheet);

      const validRecords = await fileServices.hasRequiredColumns(
        await fileServices.getRequiredColumns(sheetName.split('-')[0].split('+')[0]),
        await fileServices.getSheetColumnNames(sheet)
      );

      if (!validRecords) {
        throw new ApiError(httpStatus.CONFLICT, `No Valid Record For This "${sheetName}" Sheet Found`);
      }

      switch (sheetName) {
        case 'verses':
          successArr.push({ sheetName, success: await fileServices.verseInsertBulk(dataSet) });
          break;

        case 'Sample-index':
          successArr.push({ sheetName, success: await fileServices.wordInsertBulk(dataSet) });
          break;

        case 'Qurana':
          successArr.push({ sheetName, success: await fileServices.quranaInsertBulk(dataSet) });
          break;

        case 'khadija':
          successArr.push({ sheetName, success: await fileServices.khadijaInsertBulk(dataSet) });
          break;

        case 'Mushaf-C-SA':
        case 'mushaf+':
          successArr.push({ sheetName, success: await fileServices.mushafInsertBulk(dataSet) });
          break;

        default:
          break;
      }
    }

    if (successArr.every((item) => item.success)) {
      return res.status(httpStatus.OK).json({
        success: true,
        message: 'File uploaded and parsed successfully',
        updatedTables: successArr.map((item) => item.sheetName),
      });
    }

    return res.status(httpStatus.EXPECTATION_FAILED).json({
      success: false,
      message: 'File uploaded but not parsed',
    });
  }

  if (req.params.fileNature === 'tags') {
    return res.status(httpStatus.NOT_IMPLEMENTED).json({
      success: false,
    });
  }

  return res.status(httpStatus.NOT_ACCEPTABLE).json({
    success: true,
    message: 'Nothing to do',
  });
});

module.exports = {
  fileUpload,
};
