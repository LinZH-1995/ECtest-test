const passport = require('../config/passport.js')

module.exports = {
  localStrategyAuth: (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) return next(error)
      if (!user) return res.status(401).json({ status: 'error', message: info.message })
      delete user.password
      req.user = user
      next()
    })(req, res, next)
  },

  jwtStrategyAuth: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
      if (error) return next(error)
      if (!user) return res.status(401).json({ status: 'error', message: info.message })
      req.user = user
      next()
    })(req, res, next)
  }
}
