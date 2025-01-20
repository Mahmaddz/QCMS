const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate() {
      // Tag.belongsTo(models.Verse, {
      //   foreignKey: 'suraNo',
      //   targetKey: 'suraNo',
      //   as: 'verse',
      // });
      // Tag.belongsTo(models.Verse, {
      //   foreignKey: 'ayaNo',
      //   targetKey: 'ayaNo',
      //   as: 'verseByAya',
      // });
    }
  }
  Tag.init(
    {
      suraNo: DataTypes.INTEGER,
      ayaNo: DataTypes.INTEGER,
      category: DataTypes.STRING,
      arabic: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Tag',
      tableName: 'Tags',
      timestamps: true,
    }
  );
  return Tag;
};
