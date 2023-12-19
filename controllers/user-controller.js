const userServices = require('../services/user-services.js')

const userController = {
  signUp: async (req, res, next) => {
    userServices.signUp(req.body, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  }
}

module.exports = userController
