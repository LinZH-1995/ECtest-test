const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller.js') // import userController from controllers folder
const passport = require('../config/passport.js') // import passport from config folder

router.post('/signup', userController.signUp)

router.post('/signin', passport.authenticate('local'), userController.signIn)

module.exports = router
