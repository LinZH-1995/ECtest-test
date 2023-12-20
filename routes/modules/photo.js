const express = require('express')
const router = express.Router()

const photoController = require('../../controllers/photo-controller.js') // import photoController

const { upload } = require('../../middleware/multer.js') // import multer middleware

router.get('/:id/download', photoController.downloadPhoto)

router.get('/:id', photoController.getPhoto)

router.put('/:id', upload.single('image'), photoController.putPhoto)

router.post('/', upload.single('image'), photoController.postPhoto) // single只能上傳單一檔案，約定req.body傳回名稱為image

router.get('/', photoController.getPhotos)

module.exports = router
