'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Album.belongsTo(models.User, { foreignKey: 'userId' })
      Album.hasMany(models.Photo, { foreignKey: 'albumId' })
    }
  }
  Album.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Album',
    tableName: 'Albums',
    underscored: true
  })
  return Album
}