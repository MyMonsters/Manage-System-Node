const express = require('express')
const router = new express()
const handler = require('../router_handler/project')
router.get('/getProject',handler.getProject)
router.get('/deleteProject/:id',handler.deleteProjectById)
router.post('/addProject',handler.addProject)
router.post('/updateProject',handler.updateProjectById)
module.exports = router