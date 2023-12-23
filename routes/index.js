const { check } = require('express-validator')
const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller.js') // import userController from controllers folder
const { localStrategyAuth, jwtStrategyAuth } = require('../middleware/auth.js') // import auth middleware from middleware folder
const { errorHandler } = require('../middleware/error-handler.js')

const albums = require('./modules/albums.js') // import albums route
const photos = require('./modules/photo.js') // import photos route

// ↓ 先用註釋說明這個標籤的路由作用，並以標籤分類路由
/**
 * @swagger
 * tags:
 *  name: Albums
 *  description: '管理相簿資料的 API'
 */
router.use('/albums', jwtStrategyAuth, albums)

// ↓ 先用註釋說明這個標籤的路由作用，並以標籤分類路由
/**
 * @swagger
 * tags:
 *  name: Photos
 *  description: '管理相片資料的 API'
 */
router.use('/photos', jwtStrategyAuth, photos)

// ↓ 先用註釋說明這個標籤的路由作用，並以標籤分類路由
/**
 * @swagger
 * tags:
 *  name: SignUp/SignIn
 *  description: '註冊與登入的 API'
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     tags: [SignUp/SignIn]
 *     summary: '註冊'
 *     description: signup a account
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *      $ref: '#/components/requestBodies/signUp'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       500:
 *         description: Internal Server Error
 */
router.post('/signup', check('email').isEmail(), userController.signUp) // express-validator套件檢查email格式

/**
 * @swagger
 * /api/signin:
 *   post:
 *     tags: [SignUp/SignIn]
 *     summary: 登入並簽發JWT token
 *     description: signin a JWT token for user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/signIn'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200/GeneralRes'
 *       401:
  *        $ref: '#/components/responses/400'
 */
router.post('/signin', localStrategyAuth, userController.signIn)

router.use(errorHandler) // 所有api最後都會跑errorHandler

module.exports = router
