const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const { User } = require('../models') // import models from model folder

const userServices = {
  signUp: async (req, callback) => {
    try {
      // 驗證email格式
      const validResult = validationResult(req)
      if (!validResult.isEmpty()) throw new Error('輸入資料格式錯誤!')

      if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不同!')
      const data = {
        email: req.body.email?.trim(), // trim()防止全部都是空格
        password: req.body.password?.trim()
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

  signIn: async (req, callback) => {
    try {
      const user = req.user
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' })
      return callback(null, { user, token })
    } catch (error) {
      return callback(error, null)
    }
  }
}

module.exports = userServices
