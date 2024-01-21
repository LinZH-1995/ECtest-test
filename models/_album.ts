// Packages
import { Model, DataTypes } from 'sequelize'

// Folder
import sequelize from '../config/_config'
import User from './_user'
import Photo from './_photo'

class Album extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate (): void {
    // define association here
    Album.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' })
    Album.hasMany(Photo, { foreignKey: 'albumId', onDelete: 'CASCADE' })
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

export default Album
