const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller.js') // import userController from controllers folder

router.post('/signup', userController.signUp)

module.exports = router
