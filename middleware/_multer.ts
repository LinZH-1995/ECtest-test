import multer from 'multer'
import fs from 'fs'

const upload = multer({
  // 檔案上傳路徑
  dest: 'temp/',
  // 限制只能上傳jpg、jpeg、png三種副檔名的檔案
  fileFilter (_req, file, cb) {
    const fileName = file.originalname
    if (fileName.match(/\.(jpg|jpeg|png)$/) === null) {
      cb(new Error('Please upload an image!'))
      return
    }
    cb(null, true)
  }
})

// 檔案轉移並寫入uploads資料夾，如檔案上傳失敗則無
const localFileHandler = async (file: Express.Multer.File): Promise<unknown> => {
  return await new Promise((resolve, reject) => {
    try {
      if (file === null || file === undefined) { resolve(null); return }
      const fileName = `uploads/${file.originalname}`
      const data = fs.readFileSync(file.path)
      fs.writeFileSync(fileName, data)
      fs.rmSync(file.path) // 上傳完成後刪除temp資料夾臨時檔案
      resolve(`/${fileName}`)
    } catch (error) {
      reject(error)
    }
  })
}

export {
  upload,
  localFileHandler
}
