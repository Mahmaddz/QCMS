const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tags.belongsTo(models.Status, {
        foreignKey: 'statusId',
        as: 'tagStatus',
      });
      Tags.belongsTo(models.Action, {
        foreignKey: 'actionId',
        as: 'tagAction',
      });
    }
  }
  Tags.init(
    {
      suraNo: DataTypes.INTEGER,
      verseNo: DataTypes.INTEGER,
      wordNo: DataTypes.INTEGER,
      segment: DataTypes.INTEGER,
      source: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
      en: DataTypes.STRING,
      ar: DataTypes.STRING,
      type: DataTypes.STRING,
      actionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Tags',
    }
  );
  return Tags;
};
