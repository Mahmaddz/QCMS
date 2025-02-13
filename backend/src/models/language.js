// models/language.js
module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
  });

  Language.associate = (models) => {
    Language.hasMany(models.Translator, {
      foreignKey: 'langId', // This is the foreign key in the Translators table
      as: 'translator', // Alias for the association
    });
  };

  return Language;
};
