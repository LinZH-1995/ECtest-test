const request = require('supertest') // 不用開啟server就能模擬發送request
const chai = require('chai') // chai斷言庫
const bcrypt = require('bcryptjs')

const app = require('../../app.js') // 載入app供測試使用
const db = require('../../models') // 載入model供測試使用
const expect = chai.expect // 使用chai的should語言

describe('測試 Album API', () => {
  // 測試開始前註冊測試user並登入取得JWT token
  let token
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMzMxOTI0NSwiZXhwIjoxNzAzNDA1NjQ1fQ.xamr7h8TyTqPJDepmCChytSX7pscCOLkhnU-uah0Afw'
  let albumId
  let userId

  before(async () => {
    // 創建新user
    const password = await bcrypt.hash('123456', 10)
    const user = await db.User.create({ email: 'user@example.com', password })

    // 登入獲取JWT token
    const response = await request(app).post('/api/signin')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ email: 'user@example.com', password: '123456' })
    token = response.body.data.token
    userId = user.id
  })

  // 開始測試
  describe('=== 測試 /api/albums --> postAlbum ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).post('/api/albums')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ title: 'test' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message', 'JWT驗證失敗!')
    })

    it('--相簿標題未填寫--', async () => {
      const response = await request(app).post('/api/albums')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '標題為必填!')
    })

    it('--成功新增相簿--', async () => {
      const [response, responseTwo] = await Promise.all([
        request(app).post('/api/albums')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'test' }),
        request(app).post('/api/albums')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'test2' })
      ])

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.property('postAlbum').that.include({ userId, title: 'test' })

      albumId = responseTwo.body.data.postAlbum.id // 將第二個相簿ID記錄下來，以便下方測試使用
    })
  })

  describe('=== 測試 /api/albums --> getAlbums ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).get('/api/albums')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message', 'JWT驗證失敗!')
    })

    it('--取得使用者所有albums--', async () => {
      const response = await request(app).get('/api/albums')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.all.keys('albumsCounts', 'albums')
      expect(response.body.data.albumsCounts).is.a('number').and.equal(response.body.data.albums.length)
      expect(response.body.data.albums).is.an('array')
      response.body.data.albums.forEach((album) => {
        expect(album).have.any.keys('id', 'userId', 'title').and.include({ userId })
      })
    })
  })

  describe('=== 測試 /api/albums/:id --> getAlbum ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).get(`/api/albums/${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message', 'JWT驗證失敗!')
    })

    it('--取得使用者某相簿--', async () => {
      const response = await request(app).get(`/api/albums/${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.property('album').that.have.any.keys('id', 'userId', 'title').and.include({ userId })
    })
  })

  describe('=== 測試 /api/albums/:id --> putAlbum ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).put(`/api/albums/${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message', 'JWT驗證失敗!')
    })

    it('--相簿標題未填寫--', async () => {
      const response = await request(app).put(`/api/albums/${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '標題為必填!')
    })

    it('--欲修改相簿不存在--', async () => {
      const response = await request(app).put('/api/albums/999')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'test' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '相簿不存在!')
    })

    it('--成功修改相簿--', async () => {
      const response = await request(app).put(`/api/albums/${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'test edit album' })

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.any.keys('editCount', 'editAlbum')
      expect(response.body.data.editCount).is.a('number').and.equal(1)
      expect(response.body.data.editAlbum)
        .is.an('object')
        .have.any.keys('id', 'userId', 'title')
        .that.includes({ id: albumId, userId, title: 'test edit album' })
    })
  })

  describe('=== 測試 /api/albums/:id --> deleteAlbum ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).delete(`/api/albums/${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message', 'JWT驗證失敗!')
    })

    it('--欲刪除相簿不存在--', async () => {
      const response = await request(app).delete('/api/albums/999')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '相簿不存在!')
    })

    it('--成功刪除相簿--', async () => {
      const response = await request(app).delete(`/api/albums/${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.deep.property('data', { deleteAlbumCount: 1 })
    })
  })

  // 測試完成後清空使用者資料(級聯同時刪除子資料)
  after(async () => {
    await db.User.truncate({ cascade: true })
  })
})
