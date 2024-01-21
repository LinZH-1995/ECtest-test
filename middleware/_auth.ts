// Packages
import passport from '../config/_passport'

// Types
import type { Request, Response, NextFunction } from 'express'

interface requestUser {
  id: number
  email: string
  password?: string
  createdAt?: string
  updatedAt?: string
}

function localStrategyAuth (req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('local', (error: Error | null, user: requestUser, info?: Record<string, string>) => {
    if (error !== null) { next(error); return }
    if (user === null) return res.status(401).json({ status: 'error', message: info?.message })
    delete user.password
    req.user = user
    next()
  })(req, res, next)
}

function jwtStrategyAuth (req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('jwt', { session: false }, (error: Error | null, user: requestUser, info?: Record<string, string>) => {
    if (error !== null) { next(error); return }
    if (user === null) return res.status(401).json({ status: 'error', message: info?.message })
    req.user = user
    next()
  })(req, res, next)
}

export { localStrategyAuth, jwtStrategyAuth }
