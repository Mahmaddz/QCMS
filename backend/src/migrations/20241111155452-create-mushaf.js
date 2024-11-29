module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mushaf', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      is_chapter_name: {
        type: Sequelize.INTEGER,
      },
      is_basmalla: {
        type: Sequelize.INTEGER,
      },
      Chapter: {
        type: Sequelize.INTEGER,
      },
      Verse: {
        type: Sequelize.INTEGER,
      },
      word: {
        type: Sequelize.STRING,
      },
      Stem: {
        type: Sequelize.STRING,
      },
      Stem_pattern: {
        type: Sequelize.STRING,
      },
      PoS_tags: {
        type: Sequelize.STRING,
      },
      Lemma: {
        type: Sequelize.STRING,
      },
      lemma_pattern: {
        type: Sequelize.STRING,
      },
      Root: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Mushaf');
  },
};
