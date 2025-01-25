const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Action extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Action.hasMany(models.Tag, { foreignKey: 'actionId', as: 'tags' });
    }
  }
  Action.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      actionDef: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Action',
      tableName: 'Action',
    }
  );
  return Action;
};
