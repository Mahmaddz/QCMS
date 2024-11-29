/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Action',
      [
        {
          actionDef: 'Add Tag',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          actionDef: 'Delete Tag',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          actionDef: 'Update Tag',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          actionDef: 'Add Comment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          actionDef: 'Delete Comment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          actionDef: 'Update Comment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Action', null, {});
  },
};
