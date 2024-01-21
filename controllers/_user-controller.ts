// Types
import type { Request, Response, NextFunction } from 'express'

// Folders
import userServices from '../services/_user-services'

// Controllers
const userController = {
  signUp: (req: Request, res: Response, next: NextFunction) => {
    void userServices.signUp(req, (err: Error | null, data: Record<string, unknown> | null) => { err !== null ? next(err) : res.json({ status: 'Success', data }) })
  },

  signIn: (req: Request, res: Response, next: NextFunction) => {
    void userServices.signIn(req, (err: Error | null, data: Record<string, unknown> | null) => { err !== null ? next(err) : res.json({ status: 'Success', data }) })
  }
}

export default userController
