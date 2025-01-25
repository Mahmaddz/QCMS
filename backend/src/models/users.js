const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    async setPassword(value) {
      const saltRounds = 10;
      this.setDataValue('password', await bcrypt.hash(value, saltRounds));
    }

    async isPasswordMatch(value) {
      return bcrypt.compare(value, this.password);
    }

    static associate(models) {
      Users.belongsTo(models.Roles, {
        foreignKey: 'roleID',
        as: 'role',
      });
      Users.hasMany(models.Token, {
        foreignKey: 'userId',
        as: 'tokens',
      });
      Users.hasMany(models.Tag, { foreignKey: 'userId', as: 'tags' });
      // Users.hasMany(models.Comment, {
      //   foreignKey: 'userId',
      //   as: 'userComments',
      // });
    }
  }
  Users.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      roleID: DataTypes.INTEGER,
      isEmailVerified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Users',
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            await user.setPassword(user.password);
          }
        },
      },
    }
  );
  return Users;
};
