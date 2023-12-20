const { Photo } = require('../models')

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
  }
}

module.exports = photoServices
