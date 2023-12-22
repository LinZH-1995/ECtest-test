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
      Album.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' })
      Album.hasMany(models.Photo, { foreignKey: 'albumId', onDelete: 'CASCADE' })
    }
  }
  Album.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE'
    },
    title: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Album',
    tableName: 'Albums',
    underscored: true
  })
  return Album
}
