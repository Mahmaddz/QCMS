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
    const requiredModels = ['verses', 'Sample-index', 'Qurana', 'khadija', 'Mushaf-C-SA'];

    // eslint-disable-next-line no-unused-vars
    const sheetsColumnNames = workbook.SheetNames.filter((sn) => requiredModels.includes(sn)).map(async (sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const dataSet = await fileServices.getDataFromSheet(sheet);

      const validRecords = dataSet.filter((record) =>
        fileServices.hasRequiredColumns(record, fileServices.getRequiredColumns(sheetName.split('-')[0]))
      );

      // if (sheetName === 'Mushaf-C-SA') {
      //   console.log(dataSet);
      //   console.log(await fileServices.getRequiredColumns(sheetName.split('-')[0]));
      //   console.log(await fileServices.getSheetColumnNames(sheetName));
      // }

      if (validRecords.length === 0) {
        console.log(validRecords);
        throw new ApiError(httpStatus.CONFLICT, `No Valid Record For This "${sheetName}" Sheet Found`);
      }

      switch (sheetName) {
        case 'verses':
          await fileServices.verseInsertBulk(validRecords);
          break;

        case 'Sample-index':
          await fileServices.wordInsertBulk(validRecords);
          break;

        case 'Qurana':
          await fileServices.quranaInsertBulk(validRecords);
          break;

        case 'khadija':
          await fileServices.khadijaInsertBulk(validRecords);
          break;

        case 'Mushaf-C-SA':
          await fileServices.mushafInsertBulk(validRecords);
          break;

        default:
          break;
      }

      return 0;
    });

    return res.status(200).json({
      success: true,
      message: 'File uploaded and parsed successfully',
    });
  }

  if (req.params.fileNature === 'tags') {
    return res.status(httpStatus.NOT_IMPLEMENTED).json({
      success: false,
    });
  }

  return res.status(httpStatus.NOT_ACCEPTABLE);
});

module.exports = {
  fileUpload,
};
