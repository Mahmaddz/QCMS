/* eslint-disable camelcase */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mushaf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // Mushaf.belongsTo(models.Verse, {
      //   foreignKey: 'Chapter', // Refers to suraNo in Verse
      //   otherKey: 'Verse', // Refers to ayaNo in Verse
      //   as: 'verse',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
    }
  }
  Mushaf.init(
    {
      is_chapter_name: DataTypes.INTEGER,
      is_basmalla: DataTypes.INTEGER,
      Chapter: DataTypes.INTEGER,
      Verse: DataTypes.INTEGER,
      word: DataTypes.STRING,
      Stem: DataTypes.STRING,
      Stem_pattern: DataTypes.STRING,
      PoS_tags: DataTypes.STRING,
      Lemma: DataTypes.STRING,
      lemma_pattern: DataTypes.STRING,
      Root: DataTypes.STRING,
      firstRoot: DataTypes.STRING,
      wordUndiacritizedWithHamza: DataTypes.STRING,
      wordUndiacritizedNoHamza: DataTypes.STRING,
      firstUndiacWithHamza: DataTypes.STRING,
      wawRemove: DataTypes.STRING,
      revise: DataTypes.STRING,
      lastYaa: DataTypes.STRING,
      wordLastLetterUndiacritizedWithHamza: DataTypes.STRING,
      wordLastLetterUndiacritizedNoHamza: DataTypes.STRING,
      wordNowaw: DataTypes.STRING,
      wordUndiacritizedWithHamzaNowaw: DataTypes.STRING,
      wordUndiacritizedNoHamzaNowaw: DataTypes.STRING,
      wordLastLetterUndiacritizedWithHamzaNowaw: DataTypes.STRING,
      wordLastLetterUndiacritizedNoHamzaNowaw: DataTypes.STRING,
      wordNoyaa: DataTypes.STRING,
      wordUndiacritizedWithHamzaNoyaa: DataTypes.STRING,
      wordUndiacritizedNoHamzaNoyaa: DataTypes.STRING,
      wordLastLetterUndiacritizedWithHamzaNoyaa: DataTypes.STRING,
      wordLastLetterUndiacritizedNoHamzaNoyaa: DataTypes.STRING,
      camelLemma: DataTypes.STRING,
      camelRoot: DataTypes.STRING,
      camelStem: DataTypes.STRING,
      camelPos: DataTypes.STRING,
      camelGloss: DataTypes.STRING,
      camelDiac: DataTypes.STRING,
      camelPattern: DataTypes.STRING,
      tashaphyneStem: DataTypes.STRING,
      tStemVsKhStem: DataTypes.STRING,
      tashaphyneRoot: DataTypes.STRING,
      sameStartWord: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Mushaf',
      tableName: 'Mushaf',
    }
  );
  return Mushaf;
};
