// Package
import bcrypt from 'bcryptjs'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

// Folder
import db from '../models/_index' // import models from model folder

// Types
interface UserType {
  id: number
  email: string
  password?: string
  createdAt?: string
  updatedAt?: string
}

// set JWT option
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET ?? bcrypt.hashSync('secret', 10)
}

// JWTStrategy
passport.use(new JwtStrategy(jwtOptions, (jwtPayload, cb) => {
  const id: number = jwtPayload.id
  db.User.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
    .then(user => {
      if (user === null) { cb(null, false, { message: 'JWT驗證失敗!' }); return }
      cb(null, user.toJSON())
    })
    .catch(error => { cb(error, false) })
}))

// LocalStrategy
passport.use(new Strategy({ usernameField: 'email' }, (email, password, cb) => { // cb = callback
  db.User.findOne({ raw: true, nest: true, where: { email }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
    .then(user => {
      if (user === null) { cb(null, false, { message: '帳號或密碼錯誤！' }); return }

      const match = bcrypt.compareSync(password, user.get('password') as string) // bcrypt套件比對輸入密碼與資料庫加密密碼是否一致
      if (match) { cb(null, user.toJSON()); return }
      cb(null, false, { message: '帳號或密碼錯誤！' })
    })
    .catch(error => { cb(error, false) })
}))

// Session
passport.serializeUser((user, cb) => {
  cb(null, (user as UserType).id)
})

passport.deserializeUser((id, cb) => {
  db.User.findByPk(id as number, {
    nest: true,
    attributes: { exclude: ['password'] } // 不撈密碼以減少密碼洩漏
  }).then(user => {
    if (user === null) { cb(null, false); return }
    cb(null, user.toJSON())
  }).catch(error => {
    cb(error, false)
  })
})

export default passport
