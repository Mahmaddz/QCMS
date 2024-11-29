/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Statuses',
      [
        {
          statusDef: 'Submitted',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          statusDef: 'Approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          statusDef: 'Decline',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Statuses', null, {});
  },
};
