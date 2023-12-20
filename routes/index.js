const { check } = require('express-validator')
const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller.js') // import userController from controllers folder
const { localStrategyAuth, jwtStrategyAuth } = require('../middleware/auth.js') // import auth middleware from middleware folder

const albums = require('./modules/albums.js') // import albums route
const photos = require('./modules/photo.js') // import photos route

router.use('/albums', jwtStrategyAuth, albums)

router.use('/photos', jwtStrategyAuth, photos)

router.post('/signup', check('email').isEmail(), userController.signUp) // express-validator套件檢查email格式

router.post('/signin', localStrategyAuth, userController.signIn)

module.exports = router
