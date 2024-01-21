// Packages
import { Router } from 'express'

// Folders
import userController from '../controllers/_user-controller'
import { localStrategyAuth } from '../middleware/_auth' // import auth middleware from middleware folder
import { errorHandler } from '../middleware/_error-handler'

// Variables
const router = Router()

router.post('/signup', userController.signUp)

router.post('/signin', localStrategyAuth, userController.signIn)

router.use(errorHandler) // 所有api最後都會跑errorHandler

export default router
