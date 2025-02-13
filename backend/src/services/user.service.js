const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { Users, Roles, Op } = require('../models');
const ApiError = require('../utils/ApiError');
const rolesServices = require('./roles.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const { email, password, username } = userBody;
  const existingUser = await Users.findOne({ where: { email } });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'EMAIL IS ALREADY IN USE');
  }

  return Users.create({
    username,
    email,
    password,
    roleID: 2,
  });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return Users.findOne({ where: { id } });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */

const getUserByEmail = async (email) => {
  return Users.findOne({
    where: {
      email,
    },
  });
};

const getUserByEmailWithRole = async (email) => {
  return Users.findOne({
    where: {
      email,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Roles,
        as: 'role',
        attributes: ['roleName'],
      },
    ],
  });
};

const getUserByIdWithRole = async (id) => {
  return Users.findOne({
    where: {
      id,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Roles,
        as: 'role',
        attributes: ['roleName'],
      },
    ],
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updates) => {
  return Users.update(updates, {
    where: { id: userId },
  });
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const getUsersWithRoles = async () => {
  return Users.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'password'],
    },
    where: { id: { [Op.ne]: 2 } }, // SUPER ADMIN
    include: [
      {
        model: Roles,
        as: 'role',
        attributes: ['roleName'],
      },
    ],
    order: [['id', 'ASC']],
  });
};

const updateUserRoleByID = async (userId, newRole) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User having ID ${userId} not found`);
  }

  const role = await rolesServices.getRoleById(newRole);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, `Role ${newRole} not found`);
  }

  return Users.update(
    { roleID: newRole },
    {
      where: {
        id: userId,
      },
    }
  );
};

const updatePassword = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return Users.update(
    { password: hashedPassword },
    {
      where: { id },
    }
  );
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByEmailWithRole,
  getUsersWithRoles,
  updateUserRoleByID,
  getUserByIdWithRole,
  updatePassword,
};
