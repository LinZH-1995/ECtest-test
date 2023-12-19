const userServices = require('../services/user-services.js')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req.body, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  },

  signIn: (req, res, next) => {
    userServices.signIn(req.user, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  }
}

module.exports = userController
