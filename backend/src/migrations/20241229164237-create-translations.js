module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Translations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sura: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      aya: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      translatorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Translators',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Translations');
  },
};
