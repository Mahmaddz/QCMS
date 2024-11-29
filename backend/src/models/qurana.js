const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Qurana extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // Qurana.belongsTo(models.Verse, {
      //   foreignKey: 'ayahId',
      //   targetKey: 'ayaNo',
      //   as: 'verse',
      // });
    }
  }
  Qurana.init(
    {
      surahId: DataTypes.INTEGER,
      ayahId: DataTypes.INTEGER,
      segmentId: DataTypes.INTEGER,
      conceptNameAr: DataTypes.STRING,
      conceptNameEn: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Qurana',
    }
  );
  return Qurana;
};
