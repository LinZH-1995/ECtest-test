// Packages
import { Router } from 'express'

// Folders
import userController from '../../controllers/_user-controller'

class userRouter {
  router = Router()
  controller = userController
  constructor () {
    this.init()
  }

  init (): Router {
    return this.router.post('/signup', this.controller.signUp)
  }
}

export default userRouter
