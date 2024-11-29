const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model) {
      Status.hasMany(model.Tags, {
        foreignKey: 'statusId',
        as: 'tagStatus',
      });
    }
  }
  Status.init(
    {
      statusDef: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Status',
      tableName: 'Statuses',
    }
  );
  return Status;
};
