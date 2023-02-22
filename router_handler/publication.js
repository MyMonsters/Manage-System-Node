const db = require('../db/index')
exports.getPublication = (req, res) => {
    const sql = 'select * from publication where isdelete=0 order by id asc'
    db.query(sql,(err,results) => {
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:'获取论文数据成功！',
            data:results
        })
    })
}
exports.addPublication = (req, res) => {
    const sql = 'insert into publication set ?'
    db.query(sql,req.body,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('新增失败！')
        res.send({
            message:'添加成功！',
            code:200,
            id:results.insertId
        })
    })
}

exports.deletePublicationById = (req, res) => {
    const sql = 'update publication set isdelete=1 where id=?'
    db.query(sql,req.params.id,(err, results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('删除失败')
        res.cc('删除成功！')
    })
    
}

exports.updatePublicationById = (req, res) => {
    const sql = 'update publication set ? where id=?'
    db.query(sql,[req.body,req.body.id],(err, results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('修改失败！')
        res.cc('修改论文数据成功！',0)
    })
}