const request = require('supertest') // 不用開啟server就能模擬發送request
const chai = require('chai') // chai斷言庫

const app = require('../../app.js') // 載入app供測試使用
const db = require('../../models') // 載入model供測試使用
const expect = chai.expect // 使用chai的should語言

describe('測試 SignUP/SignIn API', () => {
  // 測試開始前清空使用者資料(級聯同時刪除子資料)
  before(async () => {
    await db.User.truncate({ cascade: true })
  })

  // 開始測試 SignUp
  describe('=== 測試 /api/signup ===', () => {
    it('--輸入錯誤email資料格式--', async () => {
      const response = await request(app).post('/api/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ email: '123@456.789', password: '123456', checkPassword: '123456' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '輸入資料格式錯誤!')
    })

    it('--輸入密碼與確認密碼不同--', async () => {
      const response = await request(app).post('/api/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ email: 'user@example.com', password: '123456', checkPassword: '123456789' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '密碼與確認密碼不同!')
    })

    it('--缺少某個輸入欄位--', async () => {
      const response = await request(app).post('/api/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ email: 'user@example.com', password: '', checkPassword: '' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '所有欄位皆為必填!')
    })

    it('--註冊成功--', async () => {
      const response = await request(app).post('/api/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ email: 'user@example.com', password: '123456', checkPassword: '123456' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.property('createdUser')
      expect(response.body.data.createdUser).have.property('email', 'user@example.com')
    })

    it('--email已被註冊過--', async () => {
      const response = await request(app).post('/api/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ email: 'user@example.com', password: '123456', checkPassword: '123456' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '此email已註冊過!')
    })
  })

  // 開始測試 SignIn
  describe('=== 測試 /api/signin ===', () => {
    it('--登入帳號錯誤--', async () => {
      const response = await request(app).post('/api/signin')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ email: 'xxx@example.com OR \'1\' = \'1\'', password: '123456' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message', '帳號或密碼錯誤！')
    })

    it('--登入密碼錯誤--', async () => {
      const response = await request(app).post('/api/signin')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ email: 'user@example.com', password: '123456789' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message', '帳號或密碼錯誤！')
    })

    it('--登入成功--', async () => {
      const response = await request(app).post('/api/signin')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ email: 'user@example.com', password: '123456' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.all.keys('user', 'token')
      expect(response.body.data.user).have.property('email', 'user@example.com')
      expect(response.body.data.token).is.a('string')
    })
  })

  // 測試完成後清空使用者資料(級聯同時刪除子資料)
  after(async () => {
    await db.User.truncate({ cascade: true })
  })
})
