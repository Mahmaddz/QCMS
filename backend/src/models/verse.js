const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Verse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // Verse.hasMany(models.Mushaf, {
      //   foreignKey: 'Chapter',
      //   otherKey: 'Verse',
      //   as: 'mushafEntries',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // Verse.hasMany(models.Word, {
      //   foreignKey: 'surahId',
      //   sourceKey: 'suraNo',
      //   as: 'words',
      // });
      // Verse.hasMany(models.Qurana, {
      //   foreignKey: 'surahId',
      //   sourceKey: 'suraNo',
      //   as: 'quranas',
      // });
      // VERSE (one) ASSOCIATION WITH TAGS (many)
      Verse.hasMany(models.Tag, {
        foreignKey: 'suraNo',
        sourceKey: 'suraNo',
        as: 'tagsBySura',
      });
      Verse.hasMany(models.Tag, {
        foreignKey: 'ayaNo',
        sourceKey: 'ayaNo',
        as: 'tagsByAya',
      });
    }
  }
  Verse.init(
    {
      jozz: DataTypes.INTEGER,
      page: DataTypes.INTEGER,
      suraNo: DataTypes.INTEGER,
      suraNameEn: DataTypes.STRING,
      suraNameAr: DataTypes.STRING,
      ayaNo: DataTypes.INTEGER,
      uthmaniTextDiacritics: DataTypes.TEXT,
      emlaeyTextNoDiacritics: DataTypes.TEXT,
      emlaeyTextDiacritics: DataTypes.TEXT,
      englishTranslation: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Verse',
      tableName: 'Verses',
      indexes: [
        {
          fields: ['suraNo', 'ayaNo'],
        },
        {
          unique: true,
          fields: ['id', 'suraNo', 'ayaNo'],
        },
      ],
    }
  );
  return Verse;
};
