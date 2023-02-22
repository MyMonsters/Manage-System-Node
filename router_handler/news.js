const db = require('../db/index');
const COS = require('cos-nodejs-sdk-v5');
var cos = new COS({
  SecretId: 'AKIDLZvYM3hIlFmOwPWkv2CFD7wmZIxVwFRU',
  SecretKey: 'Lhw7XvDOTSMAsUM5f4MZmuyAHwWyJWdf',
});
exports.addNews = (req, res) => {
  const sql = 'insert into news set ?';
  db.query(sql, req.body, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('添加news失败！');
    res.send({
      message: '添加成功！',
      id: results.insertId,
    });
  });
};
exports.updateNewsById = (req, res) => {
  const sql = 'update news set ? where id=?';
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('更新news失败！');
    res.cc('修改news成功！', 0);
  });
};

exports.deleteNewsById = (req, res) => {
  const sql = 'update news set isdelete=1 where id=?';
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('删除失败！');
    res.cc('删除成功！');
  });
};
exports.uploadImg = (req, res) => {
  console.log(req.files)
 fs.renameSync(
   './static/imgs/' + req.files[0].filename,
   './static/imgs/n' + req.body.id + '.jpg'
 );
const filePath = './static/imgs/n' + req.body.id + '.jpg'; // 本地文件路径
cos.putObject(
  {
    Bucket: 'mystorage-1314929303' /* 填入您自己的存储桶，必须字段 */,
    Region: 'ap-chengdu' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
    Key:
      'n'+req.body.id +
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
const sql = 'update news set image=? where id=?';

db.query(
  sql,
  ['https://source.machao.group/n' + req.body.id+'.jpg', req.body.id],
  (err, results) => {
    if (err) return res.cc(err);

    if (results.affectedRows !== 1) return res.cc('上传图片失败！');
  }
);

res.send({
  status: 0,
  message: '上传成功！',
});
};
