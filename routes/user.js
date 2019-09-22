var express = require('express');
let mysql = require('mysql');
const user = require('../controller/user');
const log =require("../controller/log")
var router = express.Router();

/* GET users listing. */
router.post('/add', function (req, res, next) {
  if (req.session.logged && req.session.loginUser) {
    user.addUserStudent(req, function (err, rows) {
      if (err) {
        log.primaryAdminLog(req,`创建用户${mysql.escape(req.body.name)},数据库或请求错误。`);
        return res.json({
          code: 500,
          ret_msg: "服务器数据库操作出错，请稍后再试！",
          err_msg: err
        });
      } else {
        log.primaryAdminLog(req,`创建用户${mysql.escape(req.body.name)},卡号${mysql.escape(req.body.cardID)},操作成功。`);
        return res.json({
          code: 200,
          ret_msg: "操作成功！",
          row_msg: rows
        })
      }
    });
  } else {
    return res.json({
      code: 400,
      err_msg: '会话过期或状态异常，请重新登陆！'
    })
  }
});
router.post('/freeze', function (req, res, next) {
  user.freezeUserStudent(req,(err)=>{
    if (err) {
      log.primaryAdminLog(req,`冻结/解冻用户${mysql.escape(req.body.uuid)},操作失败,信息:${mysql.escape(err)}。`);
      return res.json({
        code:500,
        err_msg:err
      })
    }else{
      log.primaryAdminLog(req,`冻结/解冻用户${mysql.escape(req.body.uuid)},操作成功。`);
      return res.json({
        code:200,
        ret_msg:"操作成功"
      })
    }
  })
});
router.get('/basic',(req,res,next)=>{
  user.getStudentBasic(req,(err,rows)=>{
    if (err) {
      log.primaryAdminLog(req,`查询${JSON.stringify(req.query)}失败：${err}`)
      return res.json({
        code:500,
        err_msg:err
      })
    }else{
      log.primaryAdminLog(req,`查询${JSON.stringify(req.query)}成功`)
      return res.json({
        code:200,
        ret_msg:"查询成功",
        row_msg:rows
      })
    }
  })
});
router.get('/meta',(req,res,next)=>{
  user.getStudentMeta(req,(err,rows)=>{
    if (err) {
      log.primaryAdminLog(req,`查询${JSON.stringify(req.query)}失败：${err}`)
      return res.json({
        code:500,
        err_msg:err
      })
    }else{
      log.primaryAdminLog(req,`查询${JSON.stringify(req.query)}成功`)
      return res.json({
        code:200,
        ret_msg:"查询成功",
        row_msg:rows
      })
    }
  })
})
module.exports = router;
