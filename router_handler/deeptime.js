const db = require('../db/index');
const request = require('request');
exports.getMembers = (req, res) => {
  const sql =
    'select * from member  where  type=? and isdelete=0 order by id asc';
  db.query(sql, req.params.type, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: '获取成员信息成功！',
      data: results,
    });
  });
};

exports.getProject = (req, res) => {
  const sql = 'select * from project where isdelete=0 order by id asc';
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 1,
      message: '获取项目信息成功！',
      data: results,
    });
  });
};

exports.getIntroduction = (req, res) => {
  const sql = 'select * from introduction ';
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      data: results,
    });
  });
};
exports.getPublication = (req, res) => {
  const sql = 'select * from publication where isdelete=0 order by id asc';
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: '获取论文数据成功！',
      data: results,
    });
  });
};

exports.getUserIP = (req, res) => {
  var clientIp = getIp(req);
  console.log('客户端ip', clientIp);
  request(
    'https://api.ipdata.co/' +
      clientIp +
      '?api-key=fbde533a3ab0a4adc81f0cdfd05d8d95ca016106ab3396a20873009d&fields=ip,city,region,country_name,country_code,latitude,longitude',
    function (err, response, body) {
      console.log(response);
      if (!err && response.statusCode == 200) {
        //todoJSON.parse(body)
        const result = JSON.parse(body);
        const country_code = result.country_code;
        const longitude = result.longitude;
        const latitude = result.latitude;
        const sql_query_country = 'select * from visit where country=?';
        db.query(sql_query_country, country_code, (err, results) => {
          console.log(results);
          const sql_update =
            'update visit set pageview=pageview+1 where country=? or country=?';
          db.query(sql_update, [country_code, 'all'], (err, addRes) => {
            if (err) return res.cc(err);
            console.log('res', addRes);
          });
          if (results.length === 0) {
            const sql_add = 'insert into visit set ?';
            db.query(
              sql_add,
              {
                country: country_code,
                pageview: 1,
                longitude: longitude,
                latitude: latitude,
              },
              (err, addRes) => {
                if (err) return res.cc(err);
              }
            );
          }
        });
        const sql_query_pv = 'select * from visit where country =? ';
        db.query(sql_query_pv, 'all', (err, pv_result) => {
          if (err) return res.cc(err);
          res.send({
            status: 0,
            ip: clientIp,
            res: response.body,
            pv: pv_result[0].pageview,
          });
        });
      }
    }
  );

  //   res.json({'youIp':clientIp});
};

exports.getPoint = (req, res) => {
  const sql = 'select * from visit where country != ?';
  db.query(sql, 'all', (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: '获取point成功！',
      data: results,
    });
  });
};

exports.getNews = (req, res) => {
  const sql = 'select * from news where isdelete=0 order by id asc';
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: '获取news成功！',
      data: results,
    });
  });
};
exports.getNewsById = (req, res) => {
  const sql = 'select * from news where id=? and isdelete=0';
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: '获取成功！',
      data: results,
    });
  });
};
