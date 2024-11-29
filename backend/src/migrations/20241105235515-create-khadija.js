module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Khadijas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Seg_ID: {
        type: Sequelize.INTEGER,
      },
      LOCATION: {
        type: Sequelize.STRING,
      },
      chapter_ID: {
        type: Sequelize.INTEGER,
      },
      verse_ID: {
        type: Sequelize.INTEGER,
      },
      word_ID: {
        type: Sequelize.INTEGER,
      },
      segment_ID: {
        type: Sequelize.INTEGER,
      },
      TRANS: {
        type: Sequelize.STRING,
      },
      POS: {
        type: Sequelize.STRING,
      },
      ANT: {
        type: Sequelize.STRING,
      },
      Concept: {
        type: Sequelize.INTEGER,
      },
      MORPH: {
        type: Sequelize.STRING,
      },
      ARABIC_WORD: {
        type: Sequelize.STRING,
      },
      Concept_Arabic: {
        type: Sequelize.STRING,
      },
      Concept_English: {
        type: Sequelize.STRING,
      },
      dist_s: {
        type: Sequelize.INTEGER,
      },
      dist_v: {
        type: Sequelize.INTEGER,
      },
      dist_w: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.STRING,
      },
      number: {
        type: Sequelize.STRING,
      },
      person: {
        type: Sequelize.INTEGER,
      },
      chapter_type: {
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
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Khadijas');
  },
};
