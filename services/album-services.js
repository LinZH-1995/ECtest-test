const { Album, User } = require('../models')

const albumServices = {
  postAlbum: async (req, callback) => {
    try {
      const userId = 5
      const title = req.body.title.trim()
      if (!title) throw new Error('標題為必填!')
      const user = await User.findByPk(userId, { attributes: ['id'] }) // 檢查使用者是否存在
      if (!user) throw new Error('使用者不存在!')
      const postAlbum = await Album.create({ userId, title })
      return callback(null, { postAlbum })
    } catch (error) {
      return callback(error, null)
    }
  },

  // 取得使用者所有Albums
  getAlbums: async (req, callback) => {
    try {
      const userId = 5
      const albums = await Album.findAndCountAll({ // 找出全部並計算數量
        raw: true,
        nest: true,
        where: { userId },
        order: [['createdAt', 'DESC']] // 以創建時間排序，新至舊
      })
      return callback(null, { albumsCounts: albums.count, albums: albums.rows })
    } catch (error) {
      return callback(error, null)
    }
  },

  getAlbum: async (req, callback) => {
    try {
      const userId = 5
      const albumId = req.params.id
      const album = await Album.findOne({
        nest: true,
        where: { id: albumId, userId } // WHERE id = ?albumId AND userId = ?userId
      })
      return callback(null, { album })
    } catch (error) {
      return callback(error, null)
    }
  }
}

module.exports = albumServices
