const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Word extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // Word.belongsTo(models.Verse, {
      //   foreignKey: 'ayaId',
      //   targetKey: 'ayaNo',
      //   as: 'verse',
      // });
    }
  }
  Word.init(
    {
      surahId: DataTypes.INTEGER,
      ayaId: DataTypes.INTEGER,
      suraName: DataTypes.STRING,
      word: DataTypes.STRING,
      root: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Word',
      tableName: 'Words',
    }
  );
  return Word;
};
