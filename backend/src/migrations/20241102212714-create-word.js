module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Words', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      surahId: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Verses',
        //   key: 'suraNo',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
      ayaId: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Verses',
        //   key: 'ayaNo',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
      suraName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      word: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      root: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Words');
  },
};
