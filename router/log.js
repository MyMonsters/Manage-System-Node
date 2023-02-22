const express = require('express')

const router = new express()
const handler = require('../router_handler/log')
router.post('/login',handler.login)
module.exports = router