const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      Roles.hasMany(models.Users, {
        foreignKey: 'roleID',
        as: 'users', // Using 'users' makes it clear it's a plural relationship
      });
    }
  }
  Roles.init(
    {
      roleName: DataTypes.STRING,
      roleDescription: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Roles',
    }
  );
  return Roles;
};
