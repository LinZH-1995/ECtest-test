const express = require('express')
const router = express.Router()

const albumController = require('../../controllers/album-controller.js') // import albumController

router.get('/:id', albumController.getAlbum)

router.put('/:id', albumController.putAlbum)

router.delete('/:id', albumController.deleteAlbum)

router.post('/', albumController.postAlbum)

router.get('/', albumController.getAlbums)

module.exports = router
