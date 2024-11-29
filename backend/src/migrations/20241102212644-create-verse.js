module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Verses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jozz: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      page: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      suraNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      suraNameEn: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      suraNameAr: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ayaNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      uthmaniTextDiacritics: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      emlaeyTextNoDiacritics: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      emlaeyTextDiacritics: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      englishTranslation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Verses');
  },
};
