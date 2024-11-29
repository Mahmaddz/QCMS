const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Action extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Action.hasMany(models.Tags, {
        foreignKey: 'actionId',
        as: 'tagAction',
      });
    }
  }
  Action.init(
    {
      actionDef: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Action',
    }
  );
  return Action;
};
