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
      // define association here
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
    },
    {
      sequelize,
      modelName: 'Mushaf',
      tableName: 'Mushaf',
    }
  );
  return Mushaf;
};
