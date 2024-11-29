module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Quranas', {
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
      ayahId: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Verses',
        //   key: 'ayaNo',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
      segmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      conceptNameAr: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      conceptNameEn: {
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
    await queryInterface.dropTable('Quranas');
  },
};
