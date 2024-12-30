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
      lang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'Translations',
      timestamps: true,
    }
  );

  Translation.associate = (models) => {
    Translation.belongsTo(models.Language, {
      foreignKey: 'lang_id',
      as: 'language',
    });
  };

  return Translation;
};
