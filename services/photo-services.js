const { Photo, Album } = require('../models')

const { localFileHandler } = require('../middleware/multer.js')

const photoServices = {
  // 新增相片
  postPhoto: async (req, callback) => {
    try {
      const { file } = req
      const filePath = await localFileHandler(file)
      if (!filePath) throw new Error('檔案上傳失敗!') // filePath = null上傳失敗，同相片可重複上傳
      const postPhoto = await Photo.create(Object.assign({ image: filePath }, req.body))
      return callback(null, { postPhoto })
    } catch (error) {
      return callback(error, null)
    }
  },

  // 取得使用者某相簿所有相片
  getPhotos: async (req, callback) => {
    try {
      const userId = req.user.id
      const albumId = req.query.albumId
      const album = await Album.findOne({
        where: { id: albumId, userId },
        attributes: ['id', 'userId']
      })
      if (!album) throw new Error('無法讀取他人相簿!')
      const photos = await Photo.findAndCountAll({ // 找出全部並計算數量
        raw: true,
        nest: true,
        where: { albumId },
        order: [['createdAt', 'DESC']] // 以創建時間排序，新至舊
      })
      return callback(null, { photosCounts: photos.count, photos: photos.rows })
    } catch (error) {
      return callback(error, null)
    }
  },

  // 取得某相片
  getPhoto: async (req, callback) => {
    try {
      const userId = req.user.id
      const albumId = req.query.albumId
      const album = await Album.findOne({
        where: { id: albumId, userId },
        attributes: ['id', 'userId']
      })
      if (!album) throw new Error('無法讀取他人相簿!')
      const photo = await Photo.findOne({ // 找出全部並計算數量
        nest: true,
        where: { albumId }
      })
      return callback(null, { photo })
    } catch (error) {
      return callback(error, null)
    }
  }
}

module.exports = photoServices
