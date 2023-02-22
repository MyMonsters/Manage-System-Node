const express = require('express');
const router = new express();
const handler = require('../router_handler/news');
const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/imgs');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '.jpg');
  },
});
var upload = multer({ storage: storage });

router.get('/deleteNews/:id', handler.deleteNewsById);
router.post('/addNews', handler.addNews);
router.post('/updateNews', handler.updateNewsById);
router.post('/uploadImg', upload.any(), handler.uploadImg);
module.exports = router;
