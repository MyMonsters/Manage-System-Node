const db = require('../db/index')
fs = require('fs')




exports.updateIntroduction = (req,res) => {
    const sql = 'update introduction set ? where id=1'
    db.query(sql,req.body,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('更新失败！')
        res.cc('更新成功！')
    })
}

exports.getIntroduction = (req, res) => {
    const sql = 'select * from introduction '
    db.query(sql,(err,results) => {
        if(err) return res.cc(err)
        res.send({
            data:results
        })
    })
}
