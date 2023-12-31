const photoServices = require('../services/photo-services.js')

const photoController = {
  postPhoto: (req, res, next) => {
    photoServices.postPhoto(req, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  },

  getPhotos: (req, res, next) => {
    photoServices.getPhotos(req, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  },

  getPhoto: (req, res, next) => {
    photoServices.getPhoto(req, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  },

  putPhoto: (req, res, next) => {
    photoServices.putPhoto(req, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  },

  downloadPhoto: (req, res, next) => {
    photoServices.downloadPhoto(req, (err, data) => err ? next(err) : res.download(data.photo))
  },

  deletePhoto: (req, res, next) => {
    photoServices.deletePhoto(req, (err, data) => err ? next(err) : res.json({ status: 'Success', data }))
  }
}

module.exports = photoController
