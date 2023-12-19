const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const { User } = require('../models') // import models from model folder

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, cb) => { // cb = callback
  try {
    // 檢查user是否存在，撈資料時不撈'createdAt', 'updatedAt'兩個欄位
    const user = await User.findOne({ nest: true, where: { email }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
    if (!user) return cb(null, false, { message: '帳號或密碼錯誤！' })
    const match = await bcrypt.compare(password, user.password) // bcrypt套件比對輸入密碼與資料庫加密密碼是否一致
    if (match) return cb(null, user.toJSON())
    return cb(null, false, { message: '帳號或密碼錯誤！' })
  } catch (error) {
    return cb(error, false)
  }
}))

passport.serializeUser((user, cb) => {
  return cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      nest: true,
      attributes: { exclude: ['password'] } // 不撈密碼以減少密碼洩漏
    })
    return cb(null, user.toJSON())
  } catch (error) {
    return cb(error, false)
  }
})

module.exports = passport
