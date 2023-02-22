const db = require('../db/index')
exports.getProject = (req,res) => {
    const sql = 'select * from project where isdelete=0 order by id asc'
    db.query(sql,(err, results) => {
        if(err) return res.cc(err)
         res.send({
            status:1,
            message:'获取项目信息成功！',
            data:results
         })
    })
}

exports.addProject = (req,res) => {
    const sql = 'insert into project set ?'
    db.query(sql,req.body,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('添加项目信息失败！')
        res.send({
            message:'添加成功！',
            code:200,
            id:results.insertId
        })
    })
}
exports.updateProjectById = (req, res) => {
    const sql = 'update project set ? where id=?'
    db.query(sql,[req.body,req.body.id],(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('更新项目信息失败！')
        res.cc('修改项目信息成功！',0)
    })
}

exports.deleteProjectById = (req, res) =>{
    const sql = 'update project set isdelete=1 where id=?'
    db.query(sql,req.params.id,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('删除失败！')
        res.cc('删除项目成功！')
    })
}