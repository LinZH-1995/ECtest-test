const { check } = require('express-validator')
const express = require('express')
const router = express.Router()

const photoController = require('../../controllers/photo-controller.js') // import photoController

const { upload } = require('../../middleware/multer.js') // import multer middleware

router.get('/:id/download', check('albumId').escape(), photoController.downloadPhoto) // express-validator套件檢查query.albumId，防止XSS

router.delete('/:id', check('albumId').escape(), photoController.deletePhoto) // express-validator套件檢查query.albumId，防止XSS

router.get('/:id', check('albumId').escape(), photoController.getPhoto) // express-validator套件檢查query.albumId，防止XSS

router.put('/:id', upload.single('image'), photoController.putPhoto)

router.post('/', upload.single('image'), photoController.postPhoto) // single只能上傳單一檔案，約定req.body傳回名稱為image

router.get('/', check('albumId').escape(), photoController.getPhotos) // express-validator套件檢查query.albumId，防止XSS

module.exports = router
