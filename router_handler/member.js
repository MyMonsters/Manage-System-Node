const db = require('../db/index')
exports.getMembers = (req, res) => {
    const sql = 'select * from member  where  type=? and isdelete=0 order by id asc'
    db.query(sql,req.params.type,(err,results) => {
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:'获取成员信息成功！',
            data:results
        })
    })
}

exports.addMembers = (req, res) => {
    const sql = 'insert into member set ?'
    
    db.query(sql,req.body,(err,results) => {
        console.log(results)
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('新增失败')
        
        
        res.send({
            message:'添加成功！',
            code:200,
            id:results.insertId
        })
        
        
    })
}
exports.deleteMemberById = (req, res) =>{
    const sql = 'update member set isdelete=1 where id=?'
    db.query(sql,req.params.id,(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('删除失败！')
        res.cc('删除成员信息成功！')
    })
}
exports.updateMemberById = (req, res) => {
    const sql = 'update member set ? where id=?'
    console.log(req)
    db.query(sql,[req.body,req.body.id],(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('更新成员信息失败！')
        res.cc('修改成员信息成功！',0)
    })
}