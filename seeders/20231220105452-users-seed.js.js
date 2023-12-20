'use strict'

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('Users', [data1, data2, ...]))
    await queryInterface.bulkInsert('Users', [{
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
