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
      ret_msg: '会话过期或状态异常，请重新登陆！'
    })
  }
});
router.post('/del', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/freeze', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
