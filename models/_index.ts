// Packages
import Sequelize from 'sequelize'

// Folders
import sequelize from '../config/_config'
import User from './_user'
import Album from './_album'
import Photo from './_photo'

const db = {
  User,
  Album,
  Photo
}

Object.assign(db, { sequelize, Sequelize })

export default db
