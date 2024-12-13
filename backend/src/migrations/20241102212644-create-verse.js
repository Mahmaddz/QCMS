module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Verses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      suraNo: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ayaNo: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      jozz: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      page: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      suraNameEn: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      suraNameAr: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      uthmaniTextDiacritics: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      emlaeyTextNoDiacritics: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      emlaeyTextDiacritics: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      englishTranslation: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    // await queryInterface.addConstraint('Verses', {
    //   fields: ['suraNo', 'ayaNo'],
    //   type: 'primary key',
    //   name: 'primary_suraNo_ayaNo',
    // });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Verses');
  },
};
