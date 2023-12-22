'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Photo.belongsTo(models.Album, { foreignKey: 'albumId', onDelete: 'CASCADE' })
    }
  }
  Photo.init({
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Albums', key: 'id' },
      onDelete: 'CASCADE'
    },
    description: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Photo',
    tableName: 'Photos',
    underscored: true
  })
  return Photo
}
