const bcrypt = require('bcryptjs')

const { User } = require('../models') // import models from model folder

const userServices = {
  signUp: async (reqBody, callback) => {
    try {
      if (reqBody.password !== reqBody.checkPassword) throw new Error('密碼與確認密碼不同!')
      const data = {
        email: reqBody.email?.trim(), // trim()防止全部都是空格
        password: reqBody.password?.trim()
      }
      if (!data.email || !data.password) throw new Error('所有欄位皆為必填!')
      const user = await User.findOne({ where: { email: data.email } }) // 查詢email是否註冊過
      if (user) throw new Error('此email已註冊過!')
      const hashPassword = await bcrypt.hash(data.password, 10) // 密碼加密
      const createdUser = await User.create(Object.assign(data, { password: hashPassword }))
      return callback(null, { createdUser })
    } catch (error) {
      return callback(error, null)
    }
  },

  signIn: async (user, callback) => {
    try {
      return callback(null, { user })
    } catch (error) {
      return callback(error, null)
    }
  }
}

module.exports = userServices
