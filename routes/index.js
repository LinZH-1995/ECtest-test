const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller.js') // import userController from controllers folder
const { localStrategyAuth, jwtStrategyAuth } = require('../middleware/auth.js') // import auth middleware from middleware folder

const albums = require('./modules/albums.js') // import albums route

router.use('/albums', jwtStrategyAuth, albums)

router.post('/signup', userController.signUp)

router.post('/signin', localStrategyAuth, userController.signIn)

module.exports = router
