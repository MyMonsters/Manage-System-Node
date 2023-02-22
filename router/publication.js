const express = require('express')
const router = new express()
const handler = require('../router_handler/publication')
router.get('/getPublication',handler.getPublication)
router.post('/updatePublication',handler.updatePublicationById)
router.post('/addPublication',handler.addPublication)
router.get('deletePublication/:id',handler.deletePublicationById)


module.exports = router