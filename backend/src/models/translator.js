const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Translator extends Model {
    static associate(models) {
      Translator.belongsTo(models.Language, {
        foreignKey: 'langId', // This is the foreign key in the Translators table
        as: 'language', // Alias for the association
      });
    }
  }
  Translator.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      langId: {
        type: DataTypes.INTEGER,
      },
      authorName: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Translator',
      tableName: 'Translators',
    }
  );
  return Translator;
};
