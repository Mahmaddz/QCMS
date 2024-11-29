const { Roles } = require('../models');

const getAllUsersRoles = () => {
  return Roles.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });
};

const getRoleById = (id) => {
  return Roles.findOne({ where: { id } });
};

module.exports = {
  getAllUsersRoles,
  getRoleById,
};
