module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      suraNo: {
        type: Sequelize.INTEGER,
      },
      verseNo: {
        type: Sequelize.INTEGER,
      },
      wordNo: {
        type: Sequelize.INTEGER,
      },
      segment: {
        type: Sequelize.INTEGER,
      },
      source: {
        type: Sequelize.STRING,
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Statuses', // the table name of Status Actions
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      en: {
        type: Sequelize.STRING,
      },
      ar: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM('Qurana', 'Quranay'),
        allowNull: false,
      },
      actionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Action', // the table name of actions
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Tags');
  },
};
