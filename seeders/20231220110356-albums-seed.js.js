'use strict'

const { faker } = require('@faker-js/faker') // package for generate fake data

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('Albums', [data1, data2, ...]))
    await queryInterface.bulkInsert('Albums', Array.from({ length: 4 }, (e, i) => {
      // 每個使用者各兩個相簿
      if (i < 2) return { user_id: 1, title: faker.lorem.text(), created_at: new Date(), updated_at: new Date() }

      return { user_id: 2, title: faker.lorem.text(), created_at: new Date(), updated_at: new Date() }
    }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Albums', {})
  }
}
