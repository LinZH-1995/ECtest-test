// Packages
import { Model, DataTypes } from 'sequelize'

// Folder
import sequelize from '../config/_config'
import Album from './_album'

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate (): void {
    // define association here
    User.hasMany(Album, { foreignKey: 'userId' })
  }
}

User.init({
  email: DataTypes.STRING,
  password: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  underscored: true
})

export default User
