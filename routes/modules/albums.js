const express = require('express')
const router = express.Router()

const albumController = require('../../controllers/album-controller.js') // import albumController

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     tags: [Albums]
 *     summary: '讀取單一相簿'
 *     description: '讀取單一相簿'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: '相簿的 ID'
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', albumController.getAlbum)

/**
 * @swagger
 * /api/albums/{id}:
 *   put:
 *     tags: [Albums]
 *     summary: '修改相簿'
 *     description: '修改相簿'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: '相簿的 ID'
 *         schema:
 *           type: integer
 *     requestBody:
 *      $ref: '#/components/requestBodies/putAlbum'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', albumController.putAlbum)

/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     tags: [Albums]
 *     summary: '刪除相簿'
 *     description: '刪除相簿'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: '相簿的 ID'
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', albumController.deleteAlbum)

/**
 * @swagger
 * /api/albums:
 *   post:
 *     tags: [Albums]
 *     summary: '新增相簿'
 *     description: '新增相簿'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      $ref: '#/components/requestBodies/postAlbum'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.post('/', albumController.postAlbum)

/**
 * @swagger
 * /api/albums:
 *   get:
 *     tags: [Albums]
 *     summary: '取得使用者所有相簿'
 *     description: '取得使用者所有相簿'
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', albumController.getAlbums)

module.exports = router
