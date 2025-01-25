/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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
    const requiredModels = [req.body.selectedSheet]; // ['verses', 'Qurana', 'khadija', 'Sample-index', 'mushaf+', 'RK'];

    const successArr = [];
    let isSheetFound = false;

    for (const sheetName of workbook.SheetNames.filter((sn) => requiredModels.includes(sn))) {
      const sheet = workbook.Sheets[sheetName];
      const dataSet = await fileServices.getDataFromSheet(sheet);
      isSheetFound = true;

      const validRecords = await fileServices.hasRequiredColumns(
        await fileServices.getRequiredColumns(sheetName.split('-')[0].split('+')[0]),
        await fileServices.getSheetColumnNames(sheet)
      );

      if (!validRecords) {
        throw new ApiError(httpStatus.CONFLICT, `No Valid Record For This "${sheetName}" Sheet Found`);
      }
      logger.info(`Starting Insert Process => ${sheetName} Sheet`);

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

        case 'RK':
          successArr.push({ sheetName, success: await fileServices.rkInsertBulk(dataSet) });
          break;

        case 'Mushaf-C-SA':
        case 'mushaf+':
          successArr.push({ sheetName, success: await fileServices.mushafInsertBulk(dataSet) });
          break;

        default:
          break;
      }
    }

    if (!isSheetFound) {
      logger.error(`Sheet ${req.body.selectedSheet} Not Found`);
      return res.status(httpStatus.NOT_ACCEPTABLE).json({
        success: false,
        message: `Sheet ${req.body.selectedSheet} Not Found`,
      });
    }

    if (successArr.every((item) => item.success)) {
      logger.info(`Data Inserted in ${successArr.map((item) => item.sheetName).join(', ')} tables`);
      return res.status(httpStatus.OK).json({
        success: true,
        message: `${req.body.selectedSheet} uploaded successfully`,
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
