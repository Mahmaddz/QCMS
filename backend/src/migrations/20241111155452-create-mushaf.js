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
      firstRoot: { type: Sequelize.STRING },
      wordUndiacritizedWithHamza: { type: Sequelize.STRING },
      wordUndiacritizedNoHamza: { type: Sequelize.STRING },
      firstUndiacWithHamza: { type: Sequelize.STRING },
      wawRemove: { type: Sequelize.STRING },
      revise: { type: Sequelize.STRING },
      lastYaa: { type: Sequelize.STRING },
      wordLastLetterUndiacritizedWithHamza: { type: Sequelize.STRING },
      wordLastLetterUndiacritizedNoHamza: { type: Sequelize.STRING },
      wordNowaw: { type: Sequelize.STRING },
      wordUndiacritizedWithHamzaNowaw: { type: Sequelize.STRING },
      wordUndiacritizedNoHamzaNowaw: { type: Sequelize.STRING },
      wordLastLetterUndiacritizedWithHamzaNowaw: { type: Sequelize.STRING },
      wordLastLetterUndiacritizedNoHamzaNowaw: { type: Sequelize.STRING },
      wordNoyaa: { type: Sequelize.STRING },
      wordUndiacritizedWithHamzaNoyaa: { type: Sequelize.STRING },
      wordUndiacritizedNoHamzaNoyaa: { type: Sequelize.STRING },
      wordLastLetterUndiacritizedWithHamzaNoyaa: { type: Sequelize.STRING },
      wordLastLetterUndiacritizedNoHamzaNoyaa: { type: Sequelize.STRING },
      camelLemma: { type: Sequelize.STRING },
      camelRoot: { type: Sequelize.STRING },
      camelStem: { type: Sequelize.STRING },
      camelPos: { type: Sequelize.STRING },
      camelGloss: { type: Sequelize.STRING },
      camelDiac: { type: Sequelize.STRING },
      camelPattern: { type: Sequelize.STRING },
      tashaphyneStem: { type: Sequelize.STRING },
      tStemVsKhStem: { type: Sequelize.STRING },
      tashaphyneRoot: { type: Sequelize.STRING },
      sameStartWord: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // await queryInterface.addConstraint('Mushaf', {
    //   fields: ['Chapter', 'Verse'],
    //   type: 'foreign key',
    //   name: 'primary_suraNo_aya',
    //   references: {
    //     table: 'Verses',
    //     fields: ['suraNo', 'ayaNo'],
    //   },
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE',
    // });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Mushaf');
  },
};
