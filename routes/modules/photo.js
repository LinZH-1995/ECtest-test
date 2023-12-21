const { check } = require('express-validator')
const express = require('express')
const router = express.Router()

const photoController = require('../../controllers/photo-controller.js') // import photoController

const { upload } = require('../../middleware/multer.js') // import multer middleware

/**
 * @swagger
 * /api/photos/{id}/download:
 *   get:
 *     tags: [Photos]
 *     summary: '下載相片'
 *     description: '下載相片 (要先在本地上傳圖片到uploads資料夾)'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/photoId_path'
 *       - $ref: '#/components/parameters/albumId_query'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id/download', check('albumId').escape(), photoController.downloadPhoto) // express-validator套件檢查query.albumId，防止XSS

/**
 * @swagger
 * /api/photos/{id}:
 *   delete:
 *     tags: [Photos]
 *     summary: '刪除相片'
 *     description: '刪除相片'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/photoId_path'
 *       - $ref: '#/components/parameters/albumId_query'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', check('albumId').escape(), photoController.deletePhoto) // express-validator套件檢查query.albumId，防止XSS

/**
 * @swagger
 * /api/photos/{id}:
 *   get:
 *     tags: [Photos]
 *     summary: '讀取單一相片'
 *     description: '讀取單一相片'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/photoId_path'
 *       - $ref: '#/components/parameters/albumId_query'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', check('albumId').escape(), photoController.getPhoto) // express-validator套件檢查query.albumId，防止XSS

/**
 * @swagger
 * /api/photos/{id}:
 *   put:
 *     tags: [Photos]
 *     summary: '修改相片'
 *     description: '修改相片'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/photoId_path'
 *     requestBody:
 *       $ref: '#/components/requestBodies/putPhoto'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', upload.single('image'), photoController.putPhoto)

/**
 * @swagger
 * /api/photos:
 *   post:
 *     tags: [Photos]
 *     summary: '新增相片'
 *     description: '新增相片'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/postPhoto'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.post('/', upload.single('image'), photoController.postPhoto) // single只能上傳單一檔案，約定req.body傳回名稱為image

/**
 * @swagger
 * /api/photos:
 *   get:
 *     tags: [Photos]
 *     summary: '取得某相簿所有相片'
 *     description: '取得某相簿所有相片'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/albumId_query'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', check('albumId').escape(), photoController.getPhotos) // express-validator套件檢查query.albumId，防止XSS

module.exports = router
