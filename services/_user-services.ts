// Packages
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

// Types
import type { Request } from 'express'

// Folders
import db from '../models/_index'

type callbackFunction = (error: Error | null, data: Record<string, unknown> | null) => void

interface requestUser {
  id: number
  email?: string
  password?: string
  createdAt?: string
  updatedAt?: string
}

// Services
const userServices = {
  signUp: async (req: Request, callback: callbackFunction) => {
    try {
      // 驗證email格式
      const validResult = validationResult(req)
      if (!validResult.isEmpty()) throw new Error('輸入資料格式錯誤!')

      const data = {
        email: req.body.email?.trim(), // trim()防止全部都是空格
        password: req.body.password?.trim(),
        checkPassword: req.body.checkPassword?.trim()
      }

      if (data.email === '' || data.password === '' || data.checkPassword === '') throw new Error('所有欄位皆為必填!')

      if (data.password !== data.checkPassword) throw new Error('密碼與確認密碼不同!')

      const user = await db.User.findOne({ where: { email: data.email } }) // 查詢email是否註冊過
      if (user === null) throw new Error('此email已註冊過!')

      const hashPassword = await bcrypt.hash((data.password as string), 10) // 密碼加密
      const createdUser = await db.User.create({ email: data.email, password: hashPassword })

      callback(null, { createdUser })
    } catch (error) {
      callback(error as Error, null)
    }
  },

  signIn: async (req: Request, callback: callbackFunction) => {
    try {
      const user: requestUser = req.user as requestUser
      const secret: jwt.Secret = process.env.JWT_SECRET ?? 'SECRET'
      const token = jwt.sign(user, secret, { expiresIn: '1d' })
      callback(null, { user, token })
    } catch (error) {
      callback(error as Error, null)
    }
  }
}

export default userServices
