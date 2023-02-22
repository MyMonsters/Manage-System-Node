const express = require('express')
const router = express.Router()
const handler = require('../router_handler/member')
router.get('/getMembers/:type',handler.getMembers)
router.post('/addMember',handler.addMembers)
router.post('/updateMember',handler.updateMemberById)
router.get('/deleteMember/:id',handler.deleteMemberById)
module.exports = router