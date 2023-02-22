const express = require('express');
const app = new express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
var COS = require('cos-nodejs-sdk-v5');
const request = require('request');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});
const expressJWT = require('express-jwt');
const config = require('./config');
const key_config = require('./key-config');
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({
    path: [/^\/api\//, /^\/public\//, /^\/deeptime\//],
  })
);

app.use('/public', express.static(path.join(__dirname, './static')));
const memberRouter = require('./router/member');
const projectRouter = require('./router/project');
const otherRouter = require('./router/other');
const publicationRouter = require('./router/publication');
const log = require('./router/log');
const deeptime = require('./router/deeptime');
const news = require('./router/news');
app.use('/member', memberRouter);
app.use('/project', projectRouter);
app.use('/other', otherRouter);
app.use('/publication', publicationRouter);
app.use('/api', log);
app.use('/deeptime', deeptime);
app.use('/news', news);
const multer = require('multer');
const db = require('./db');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/imgs');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '.jpg');
  },
});
var upload = multer({ storage: storage });

var cos = new COS({
  getAuthorization: function (options, callback) {
    // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
    // 异步获取临时密钥
    request(
      {
        url: 'http://1.14.92.14:7777/sts',
        data: {
          // 可从 options 取需要的参数
        },
      },
      function (err, response, body) {
        try {
          var data = JSON.parse(body);
          var credentials = data.credentials;
        } catch (e) {}
        if (!data || !credentials) return console.error('credentials invalid');
        callback({
          TmpSecretId: credentials.tmpSecretId, // 临时密钥的 tmpSecretId
          TmpSecretKey: credentials.tmpSecretKey, // 临时密钥的 tmpSecretKey
          SecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
          ExpiredTime: data.expiredTime, // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
        });
      }
    );
  },
});
app.post('/uploadImg', upload.any(), function (req, res) {
  // console.log(req);
  fs.renameSync(
    './static/imgs/' + req.files[0].filename,
    './static/imgs/' + req.body.id + '.jpg'
  );
  const filePath = './static/imgs/' + req.body.id + '.jpg'; // 本地文件路径
  cos.putObject(
    {
      Bucket: 'mystorage-1314929303' /* 填入您自己的存储桶，必须字段 */,
      Region: 'ap-chengdu' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
      Key:
        req.body.id +
        '.jpg' /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
      StorageClass: 'STANDARD',
      /* 当Body为stream类型时，ContentLength必传，否则onProgress不能返回正确的进度信息 */
      Body: fs.createReadStream(filePath), // 上传文件对象
      ContentLength: fs.statSync(filePath).size,
      onProgress: function (progressData) {
        console.log(JSON.stringify(progressData));
      },
    },
    function (err, data) {
      console.log(err || data);
    }
  );
  const sql = 'update member set picture=? where id=?';

  db.query(
    sql,
    ['https://source.machao.group/' + req.body.id + '.jpg', req.body.id],
    (err, results) => {
      if (err) return res.cc(err);

      if (results.affectedRows !== 1) return res.cc('上传图片失败！');
    }
  );

  res.send({
    status: 0,
    message: '上传成功！',
  });
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败');
  res.cc(err);
});
app.listen(3000, function () {
  console.log('api server running at 127.0.0.1:3000');
});
