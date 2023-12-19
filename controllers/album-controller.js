const albumServices = require('../services/album-services.js')

const albumController = {
  postAlbum: (req, res, next) => {
    albumServices.postAlbum(req, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  },

  getAlbums: (req, res, next) => {
    albumServices.getAlbums(req, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  }
}

module.exports = albumController
