const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });
      Comment.belongsTo(models.Tag, {
        foreignKey: 'tagId',
        as: 'tag',
      });
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      suraNo: DataTypes.INTEGER,
      ayaNo: DataTypes.INTEGER,
      commentText: DataTypes.STRING,
      commentType: DataTypes.ENUM('SUGGESTION', 'QUESTION', 'OTHER'),
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
