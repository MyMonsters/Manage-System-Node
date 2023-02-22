const express = require('express')
const multer = require('multer')
const router = new express()
const handler = require('../router_handler/other')
router.post('/updateIntroduction',handler.updateIntroduction)
router.get('/getIntroduction',handler.getIntroduction)

module.exports = router