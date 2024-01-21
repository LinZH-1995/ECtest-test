// Packages
import { Sequelize } from 'sequelize'

// Types
import type { Dialect } from 'sequelize'

// Setting
type ENV = 'development' | 'test' | 'production'
const env = process.env.NODE_ENV ?? 'development'

const config = {
  development: {
    username: 'postgres',
    password: '123456',
    database: 'testdb',
    host: 'postgresdb',
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: '123456',
    database: 'unit_test_db',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'PRODUCTION_DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
const connection = config[env as ENV]

interface otherConfig {
  username: string
  password: string
  database: string
  host: string
  dialect: Dialect
}
interface productionConfig {
  use_env_variable: string
  dialect: Dialect
  dialectOptions: object
}

let sequelize: Sequelize
if (Object.hasOwn(connection, 'use_env_variable')) {
  const uri = process.env[(connection as productionConfig).use_env_variable] ?? ''
  sequelize = new Sequelize(uri, connection as productionConfig)
} else {
  sequelize = new Sequelize((connection as otherConfig).database, (connection as otherConfig).username, (connection as otherConfig).password, connection as otherConfig)
}

export default sequelize
