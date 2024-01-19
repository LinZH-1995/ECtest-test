const multer = require('multer')
const fs = require('fs')

const upload = multer({
  // 檔案上傳路徑
  dest: 'temp/',
  // 限制只能上傳jpg、jpeg、png三種副檔名的檔案
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image!'))
    }
    return cb(null, true)
  }
})

// 檔案轉移並寫入uploads資料夾，如檔案上傳失敗則無
const localFileHandler = (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) return resolve(null)
      const fileName = `uploads/${file.originalname}`
      const data = fs.readFileSync(file.path)
      fs.writeFileSync(fileName, data)
      fs.rmSync(file.path) // 上傳完成後刪除temp資料夾臨時檔案
      return resolve(`/${fileName}`)
    } catch (error) {
      return reject(error)
    }
  })
}

// 使用  async + await + fs.promises
// const localFileHandler = async (file) => {
//   try {
//     if (!file) return null
//     const fileName = `uploads/${file.originalname}`
//     const data = await fs.promises.readFile(file.path)
//     await fs.promises.writeFile(fileName, data)
//     await fs.promises.rm(file.path) // 上傳完成後刪除temp資料夾臨時檔案
//     return `/${fileName}`
//   } catch (error) {
//     return error
//   }
// }

// 使用  createReadStream + createWriteStream + pipe
// const { finished } = require('node:stream/promises')
// const localFileHandler = async (file) => {
//   try {
//     if (!file) return null
//     const fileName = `uploads/${file.originalname}`
//     const readStream = fs.createReadStream(file.path)
//     const writeStream = fs.createWriteStream(fileName)
//     const pipeline = readStream.pipe(writeStream)
//     console.log('======', readStream.readableEnded, '===before finish===', writeStream.writableFinished, '======')
//     await finished(pipeline)
//     console.log('======', readStream.readableEnded, '===after finish===', writeStream.writableFinished, '======')
//     await fs.promises.rm(file.path) // 上傳完成後刪除temp資料夾臨時檔案
//     return `/${fileName}`
//   } catch (error) {
//     return error
//   }
// }

module.exports = {
  upload,
  localFileHandler
}
