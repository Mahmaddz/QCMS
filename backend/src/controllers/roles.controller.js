const { rolesServices } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getRoles = catchAsync(async (req, res) => {
  const allRoles = await rolesServices.getAllUsersRoles();

  return res.status(200).json({
    success: true,
    message: 'Roles Loaded',
    data: allRoles,
  });
});

module.exports = {
  getRoles,
};
