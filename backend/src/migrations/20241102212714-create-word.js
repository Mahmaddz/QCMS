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
        allowNull: true,
      },
      ayaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      suraName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      word: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      root: {
        type: Sequelize.STRING,
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

    // Add composite foreign key constraint
    // await queryInterface.addConstraint('Words', {
    //   fields: ['surahId', 'ayaId'],
    //   type: 'foreign key',
    //   name: 'fk_words_verses', // Name of the foreign key constraint
    //   references: {
    //     table: 'Verses',
    //     fields: ['suraNo', 'ayaNo'], // Composite key fields
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'CASCADE',
    // });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Words');
  },
};
