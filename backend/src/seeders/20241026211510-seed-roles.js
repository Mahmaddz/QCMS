/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          roleName: 'Admin',
          roleDescription: '1. User Activity. 2. Approve or decline tags. 3. Change user role and Block user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: 'Reviewer',
          roleDescription: '1. Add, remove and update tags. 2. Add Comment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: 'Public',
          roleDescription: '1. Read-only',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
