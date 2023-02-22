const express = require('express');

const router = new express();
const handler = require('../router_handler/deeptime');

router.get('/getMembers/:type', handler.getMembers);
router.get('/getIntroduction', handler.getIntroduction);
router.get('/getProject', handler.getProject);
router.get('/getPublication', handler.getPublication);
router.get('/getUserIP', handler.getUserIP);
router.get('/getPoint', handler.getPoint);
router.get('/getNews', handler.getNews);
router.get('/getNewsById/:id', handler.getNewsById);
module.exports = router;
