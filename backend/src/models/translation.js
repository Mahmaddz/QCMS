module.exports = (sequelize, DataTypes) => {
  const Translation = sequelize.define(
    'Translation',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sura: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      aya: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      translatorId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'Translations',
      model: 'Translation',
      timestamps: true,
    }
  );

  Translation.associate = (models) => {
    Translation.belongsTo(models.Translator, {
      foreignKey: 'translatorId',
      as: 'translator',
    });
  };

  return Translation;
};
