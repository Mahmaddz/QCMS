const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // ---------------------------- VERSES ----------------------------
      Tag.belongsTo(models.Verse, {
        foreignKey: 'suraNo',
        targetKey: 'suraNo',
        as: 'verseBySura',
      });
      Tag.belongsTo(models.Verse, {
        foreignKey: 'ayaNo',
        targetKey: 'ayaNo',
        as: 'verseByAya',
      });

      // ---------------------------- USERS ----------------------------
      Tag.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });

      // ---------------------------- ACTIONS ----------------------------
      Tag.belongsTo(models.Action, {
        foreignKey: 'actionId',
        as: 'action',
      });

      // ---------------------------- STATUSES ----------------------------
      Tag.belongsTo(models.Status, {
        foreignKey: 'statusId',
        as: 'status',
      });

      // ---------------------------- COMMENT ----------------------------
      Tag.hasMany(models.Comment, {
        foreignKey: 'tagId',
        as: 'tag',
      });

      Tag.belongsTo(models.Mushaf, {
        foreignKey: 'suraNo',
        targetKey: 'Chapter',
      });
    }
  }
  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      suraNo: DataTypes.INTEGER,
      ayaNo: DataTypes.INTEGER,
      category: DataTypes.STRING,
      arabic: DataTypes.STRING,
      categoryOld: DataTypes.STRING,
      arabicOld: DataTypes.STRING,
      actionId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Tag',
      tableName: 'Tags',
      timestamps: true,
      paranoid: true,
    }
  );
  return Tag;
};
