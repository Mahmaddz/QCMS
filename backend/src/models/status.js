const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model) {
      Status.hasMany(model.Tag, {
        foreignKey: 'statusId',
        as: 'status',
      });
    }
  }
  Status.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      statusDef: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Status',
      tableName: 'Statuses',
    }
  );
  return Status;
};
