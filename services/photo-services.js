const path = require('path')

const { Photo, Album } = require('../models')

const { localFileHandler } = require('../middleware/multer.js')

const photoServices = {
  // 新增相片
  postPhoto: async (req, callback) => {
    try {
      // 約定新增/修改時，albumId放入body
      const userId = req.user.id
      const albumId = req.body.albumId

      // 上傳檔案
      const { file } = req
      const filePath = await localFileHandler(file)
      if (!filePath) throw new Error('檔案上傳失敗!') // filePath = null上傳失敗，同相片可重複上傳

      // 檢查是否是使用者相簿
      const album = await Album.findOne({
        where: { id: albumId, userId },
        attributes: ['id', 'userId']
      })
      if (!album) throw new Error('無法新增他人相簿!')

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
      const id = req.params.id
      const userId = req.user.id
      const albumId = req.query.albumId
      const album = await Album.findOne({
        where: { id: albumId, userId },
        attributes: ['id', 'userId']
      })
      if (!album) throw new Error('無法讀取他人相簿!')
      const photo = await Photo.findOne({ // 找出全部並計算數量
        nest: true,
        where: { albumId, id }
      })
      return callback(null, { photo })
    } catch (error) {
      return callback(error, null)
    }
  },

  // 修改某相片
  putPhoto: async (req, callback) => {
    try {
      // 約定新增/修改時，albumId放入body
      const id = req.params.id
      const userId = req.user.id
      const { albumId, description } = req.body

      // 上傳檔案
      const { file } = req
      const filePath = await localFileHandler(file)

      // 檢查是否是使用者相簿
      const album = await Album.findOne({
        where: { id: albumId, userId },
        attributes: ['id', 'userId']
      })
      if (!album) throw new Error('無法修改他人相簿!')

      // 確保要修改的相片存在
      const photo = await Photo.findOne({ where: { id, albumId }, attributes: ['image'] })
      if (!photo) throw new Error('欲修改的相片不存在!')

      const [editCount, editPhoto] = await Photo.update(
        { description, image: filePath || photo.image }, // 要修改的資料
        { where: { id, albumId }, returning: true } // option
      )
      return callback(null, { editCount, editPhoto: editPhoto[0] })
    } catch (error) {
      return callback(error, null)
    }
  },

  // 下載某相片
  downloadPhoto: async (req, callback) => {
    try {
      const id = req.params.id
      const userId = req.user.id
      const albumId = req.query.albumId

      // 檢查是否是使用者相簿
      const album = await Album.findOne({
        where: { id: albumId, userId },
        attributes: ['id', 'userId']
      })
      if (!album) throw new Error('無法下載他人相簿!')

      // 檢查相片是否存在，並只取相片檔案位置資料
      const photo = await Photo.findOne({ where: { id, albumId }, attributes: ['image'] })
      if (!photo) throw new Error('相片不存在!')

      const imagePath = path.join(__dirname, `..${photo.image}`) // C:\Users\User\project folder\uploads\1111.jpg
      return callback(null, { photo: imagePath })
    } catch (error) {
      return callback(error, null)
    }
  },

  // 刪除相片
  deletePhoto: async (req, callback) => {
    try {
      const id = req.params.id
      const userId = req.user.id
      const albumId = req.query.albumId

      // 檢查是否是使用者相簿
      const album = await Album.findOne({
        where: { id: albumId, userId },
        attributes: ['id', 'userId']
      })
      if (!album) throw new Error('無法刪除他人相簿!')

      // 刪除相片
      const deletePhotoCount = await Photo.destroy({ where: { id, albumId } })
      if (!deletePhotoCount) throw new Error('相片不存在!')
      return callback(null, { deletePhotoCount })
    } catch (error) {
      return callback(error, null)
    }
  }
}

module.exports = photoServices
