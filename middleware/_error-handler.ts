// Types
import type { Request, Response, NextFunction } from 'express'

function errorHandler (err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof Error) {
    res.status(400).json({ status: 'error', errorName: `${err.name}`, message: `${err.message}` })
  } else {
    res.status(400).json({ status: 'error', message: err })
  }
  next(err)
}

export { errorHandler }
