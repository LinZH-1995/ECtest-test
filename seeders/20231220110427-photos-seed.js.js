'use strict'

const { faker } = require('@faker-js/faker') // package for generate fake data

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('Photos', [data1, data2, ...]))
    await queryInterface.bulkInsert('Photos', Array.from({ length: 8 }, (e, i) => {
      // 每個相簿各兩張照片
      return {
        album_id: Math.floor(i / 2 + 1),
        description: faker.lorem.sentence(10),
        image: faker.image.avatar(),
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Photos', {})
  }
}
