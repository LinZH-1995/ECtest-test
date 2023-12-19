const express = require('express')
const router = express.Router()

const albumController = require('../../controllers/album-controller.js') // import albumController

router.get('/:id', albumController.getAlbum)

router.post('/', albumController.postAlbum)

router.get('/', albumController.getAlbums)

module.exports = router
