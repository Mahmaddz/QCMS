const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Khadija extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Khadija.init(
    {
      Seg_ID: DataTypes.INTEGER,
      LOCATION: DataTypes.STRING,
      chapter_ID: DataTypes.INTEGER,
      verse_ID: DataTypes.INTEGER,
      word_ID: DataTypes.INTEGER,
      segment_ID: DataTypes.INTEGER,
      TRANS: DataTypes.STRING,
      POS: DataTypes.STRING,
      ANT: DataTypes.STRING,
      Concept: DataTypes.INTEGER,
      MORPH: DataTypes.STRING,
      ARABIC_WORD: DataTypes.STRING,
      Concept_Arabic: DataTypes.STRING,
      Concept_English: DataTypes.STRING,
      dist_s: DataTypes.INTEGER,
      dist_v: DataTypes.INTEGER,
      dist_w: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      number: DataTypes.STRING,
      person: DataTypes.INTEGER,
      chapter_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Khadija',
    }
  );
  return Khadija;
};
