// Packages
import { Model, DataTypes } from 'sequelize'

// Folder
import sequelize from '../config/_config'
import Album from './_album'

class Photo extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate (): void {
    // define association here
    Photo.belongsTo(Album, { foreignKey: 'albumId', onDelete: 'CASCADE' })
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

export default Photo
