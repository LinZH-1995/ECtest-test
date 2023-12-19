'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      album_id: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Photos')
  }
}

/*
建立 table 的 SQL

CREATE TABLE Photos (
  id SERIAL PRIMARY KEY,
  albumId INTEGER,
  description VARCHAR(255),
  image VARCHAR(255),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
  )
*/
