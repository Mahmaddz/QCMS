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
    const requiredModels = ['khadija']; // ['verses', 'Qurana']; // 'khadija']; //  ['Sample-index']; // ['mushaf+'];

    // await sequelize.query('SET session_replication_role = replica;');

    // eslint-disable-next-line no-unused-vars
    const sheetsColumnNames = await workbook.SheetNames.filter((sn) => requiredModels.includes(sn)).map(
      async (sheetName) => {
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
            await fileServices.verseInsertBulk(dataSet);
            break;

          case 'Sample-index':
            await fileServices.wordInsertBulk(dataSet);
            break;

          case 'Qurana':
            await fileServices.quranaInsertBulk(dataSet);
            break;

          case 'khadija':
            await fileServices.khadijaInsertBulk(dataSet);
            break;

          case 'Mushaf-C-SA':
          case 'mushaf+':
            await fileServices.mushafInsertBulk(dataSet);
            break;

          default:
            break;
        }

        return 0;
      }
    );

    // await sequelize.query('SET session_replication_role = DEFAULT;');

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
