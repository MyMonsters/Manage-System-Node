const db = require('../db/index');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { expiresIn } = require('../config');
exports.login = (req, res) => {
  const userinfo = req.body;
  const sql = 'select * from users where username = ?';
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('用户名错误！');

    if (results[0].password !== userinfo.password) return res.cc('密码错误！');
    const user = { ...results[0] };
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });
    console.log(tokenStr);
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr,
    });
  });
};
