const request = require('supertest') // 不用開啟server就能模擬發送request
const chai = require('chai') // chai斷言庫
const bcrypt = require('bcryptjs')
const path = require('path')

const app = require('../../app.js') // 載入app供測試使用
const db = require('../../models') // 載入model供測試使用
const expect = chai.expect // 使用chai的should語言

describe('測試 Photos API', () => {
  // 測試開始前註冊測試user並登入取得JWT token與新增測試album
  let albumId
  let token
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMzMxOTI0NSwiZXhwIjoxNzAzNDA1NjQ1fQ.xamr7h8TyTqPJDepmCChytSX7pscCOLkhnU-uah0Afw'
  let photoId

  before(async () => {
    // 創建新user
    const password = await bcrypt.hash('123456', 10)
    const user = await db.User.create({ email: 'user@example.com', password })

    // 為user創建新album
    const album = await db.Album.create({ userId: user.id, title: 'test' })
    albumId = album.id

    // 登入獲取JWT token
    const response = await request(app).post('/api/signin')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ email: 'user@example.com', password: '123456' })
    token = response.body.data.token
  })

  // 開始測試
  describe('=== 測試 /api/photos --> postPhoto ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).post('/api/photos')
        .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)
        .field({ albumId, description: '123456' })
        .attach('image', path.join(__dirname, '/../../cat.png'))

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message').that.have.oneOf(['JWT驗證失敗!', 'jwt expired'])
    })

    it('--無上傳相片--', async () => {
      const response = await request(app).post('/api/photos')
        .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .field({ albumId, description: '123456' })
        .attach('image', '')

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '檔案上傳失敗!')
    })

    it('--意圖新增相片至他人相簿--', async () => {
      const response = await request(app).post('/api/photos')
        .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .field({ albumId: 999, description: '123456' })
        .attach('image', path.join(__dirname, '/../../cat.png'))

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '無法新增他人相簿!')
    })

    it('--成功上傳2張照片--', async () => {
      const [response, responseTwo] = await Promise.all([
        request(app).post('/api/photos')
          .set('Content-Type', 'multipart/form-data')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .field({ albumId, description: '123456' })
          .attach('image', path.join(__dirname, '/../../cat.png')),
        request(app).post('/api/photos')
          .set('Content-Type', 'multipart/form-data')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .field({ albumId, description: '654321' })
          .attach('image', path.join(__dirname, '/../../cat2.png'))
      ])

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.property('postPhoto').that.include({ albumId, description: '123456', image: '/uploads/cat.png' })

      photoId = responseTwo.body.data.postPhoto.id // 將第二張相片ID記錄下來，以便下方測試使用
    })
  })

  describe('=== 測試 /api/photos --> getPhotos ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).get(`/api/photos?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message').that.have.oneOf(['JWT驗證失敗!', 'jwt expired'])
    })

    it('--試圖讀取他人相簿--', async () => {
      const response = await request(app).get('/api/photos?albumId=999')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '無法讀取他人相簿!')
    })

    it('--取得某相簿所有相片--', async () => {
      const response = await request(app).get(`/api/photos?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.all.keys('photosCounts', 'photos')
      expect(response.body.data.photosCounts).is.a('number').and.equal(response.body.data.photos.length)
      expect(response.body.data.photos).is.an('array')
      response.body.data.photos.forEach((photo) => {
        expect(photo).have.any.keys('id', 'albumId', 'image', 'description').and.include({ albumId })
      })
    })
  })

  describe('=== 測試 /api/photos/:id --> getPhoto ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).get(`/api/photos/${photoId}?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message').that.have.oneOf(['JWT驗證失敗!', 'jwt expired'])
    })

    it('--試圖讀取他人相簿--', async () => {
      const response = await request(app).get(`/api/photos/${photoId}?albumId=999`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '無法讀取他人相簿!')
    })

    it('--取得某相簿某張相片--', async () => {
      const response = await request(app).get(`/api/photos/${photoId}?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.property('photo').that.include({ id: photoId, albumId })
    })
  })

  describe('=== 測試 /api/photos/:id --> putPhoto ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).put(`/api/photos/${photoId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)
        .field({ albumId, description: 'test edit photo description and image' })
        .attach('image', path.join(__dirname, '/../../cat.png'))

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message').that.have.oneOf(['JWT驗證失敗!', 'jwt expired'])
    })

    it('--意圖修改他人相簿的相片--', async () => {
      const response = await request(app).put(`/api/photos/${photoId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .field({ albumId: 999, description: 'test edit photo' })
        .attach('image', path.join(__dirname, '/../../cat.png'))

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '無法修改他人相簿!')
    })

    it('--想修改的相片不存在--', async () => {
      const response = await request(app).put('/api/photos/999')
        .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .field({ albumId, description: 'test edit photo' })
        .attach('image', path.join(__dirname, '/../../cat.png'))

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '欲修改的相片不存在!')
    })

    it('--只修改標題--', async () => {
      const response = await request(app).put(`/api/photos/${photoId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .field({ albumId, description: 'test edit photo description' })
        .attach('image', '')

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.all.keys('editCount', 'editPhoto')
      expect(response.body.data.editCount).is.a('number').and.equal(1)
      expect(response.body.data.editPhoto)
        .is.an('object')
        .have.any.keys('id', 'albumId', 'image', 'description')
        .that.includes({ id: photoId, albumId, description: 'test edit photo description' })
    })

    it('--修改標題與相片--', async () => {
      const response = await request(app).put(`/api/photos/${photoId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .field({ albumId, description: 'test edit photo description and image' })
        .attach('image', path.join(__dirname, '/../../cat.png'))

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.property('data')
      expect(response.body.data).have.all.keys('editCount', 'editPhoto')
      expect(response.body.data.editCount).is.a('number').and.equal(1)
      expect(response.body.data.editPhoto)
        .is.an('object')
        .have.any.keys('id', 'albumId', 'image', 'description')
        .that.includes({ id: photoId, albumId, description: 'test edit photo description and image', image: '/uploads/cat.png' })
    })
  })

  describe('=== 測試 /api/photos/:id/download --> downloadPhoto ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).get(`/api/photos/${photoId}/download?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message').that.have.oneOf(['JWT驗證失敗!', 'jwt expired'])
    })

    it('--意圖下載他人相簿的相片--', async () => {
      const response = await request(app).get('/api/photos/999/download?albumId=999')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '無法下載他人相簿!')
    })

    it('--想下載的相片不存在--', async () => {
      const response = await request(app).get(`/api/photos/999/download?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '相片不存在!')
    })

    it('--成功下載相片--', async () => {
      const response = await request(app).get(`/api/photos/${photoId}/download?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).is.contain.oneOf(['image/jpg', 'image/jpeg', 'image/png'])
      expect(response.status).equal(200)
      expect(response.body).is.an.instanceOf(Buffer)
    })
  })

  describe('=== 測試 /api/photos/:id --> deletePhoto ===', () => {
    it('--JWT驗證失敗--', async () => {
      const response = await request(app).delete(`/api/photos/${photoId}?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fakeToken}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(401)
      expect(response.body).have.property('message').that.have.oneOf(['JWT驗證失敗!', 'jwt expired'])
    })

    it('--意圖刪除他人相簿的相片--', async () => {
      const response = await request(app).delete('/api/photos/999?albumId=999')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '無法刪除他人相簿!')
    })

    it('--想刪除的相片不存在--', async () => {
      const response = await request(app).delete(`/api/photos/999?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(400)
      expect(response.body).have.property('message', '相片不存在!')
    })

    it('--成功刪除相片--', async () => {
      const response = await request(app).delete(`/api/photos/${photoId}?albumId=${albumId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(response.type).equal('application/json')
      expect(response.status).equal(200)
      expect(response.body).have.deep.property('data', { deletePhotoCount: 1 })
    })
  })

  // 測試完成後清空使用者資料(級聯同時刪除子資料)
  after(async () => {
    await db.User.truncate({ cascade: true })
  })
})
