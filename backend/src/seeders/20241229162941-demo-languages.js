/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Languages',
      [
        { name: 'English', code: 'en', createdAt: new Date(), updatedAt: new Date() },
        { name: 'French', code: 'fr', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Spanish', code: 'es', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Urdu', code: 'ur', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Russian', code: 'ru', createdAt: new Date(), updatedAt: new Date() },
        { name: 'German', code: 'de', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Italian', code: 'it', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Chinese', code: 'zh', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Arabic', code: 'ar', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Japanese', code: 'ja', createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Languages', null, {});
  },
};
