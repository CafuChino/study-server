var express = require('express');
let mysql = require('mysql');
const user = require('../controller/user');
const log = require("../controller/log")
var router = express.Router();

/* GET users listing. */
router.all('*', function (req, res, next) {
  //TODO:上线之前把跨域修复了
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Cache-Control", "no-store");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
router.post('/add', function (req, res, next) {
  if (req.session.logged && req.session.loginUser) {
    user.addUserStudent(req, function (err, rows) {
      if (err) {
        log.primaryAdminLog(req, `创建用户${mysql.escape(req.body.name)},数据库或请求错误。`);
        return res.json({
          code: 500,
          ret_msg: "服务器数据库操作出错，请稍后再试！",
          err_msg: err
        });
      } else {
        log.primaryAdminLog(req, `创建用户${mysql.escape(req.body.name)},卡号${mysql.escape(req.body.cardID)},操作成功。`);
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
  user.freezeUserStudent(req, (err) => {
    if (err) {
      log.primaryAdminLog(req, `冻结/解冻用户${mysql.escape(req.body.uuid)},操作失败,信息:${mysql.escape(err)}。`);
      return res.json({
        code: 500,
        err_msg: err
      })
    } else {
      log.primaryAdminLog(req, `冻结/解冻用户${mysql.escape(req.body.uuid)},操作成功。`);
      return res.json({
        code: 200,
        ret_msg: "操作成功"
      })
    }
  })
});
router.get('/basic', (req, res, next) => {
  user.getStudentBasic(req, (err, rows) => {
    if (err) {
      log.primaryAdminLog(req, `查询${JSON.stringify(req.query)}失败：${err}`)
      return res.json({
        code: 500,
        err_msg: err
      })
    } else {
      log.primaryAdminLog(req, `查询${JSON.stringify(req.query)}成功`)
      return res.json({
        code: 200,
        ret_msg: "查询成功",
        row_msg: rows
      })
    }
  })
});
router.get('/meta', (req, res, next) => {
  user.getStudentMeta(req, (err, rows) => {
    if (err) {
      log.primaryAdminLog(req, `查询${JSON.stringify(req.query)}失败：${err}`)
      return res.json({
        code: 500,
        err_msg: err
      })
    } else {
      log.primaryAdminLog(req, `查询${JSON.stringify(req.query)}成功`)
      return res.json({
        code: 200,
        ret_msg: "查询成功",
        row_msg: rows
      })
    }
  })
});
router.get('/signcheck', (req, res, next) => {
  user.getStudentInformation(req, (err, money, meta) => {
    if (err) {
      return res.json({
        code: 500,
        err: err
      })
    };
    money = money[0]
    var access = true;
    var status = "normal";
    var remain = 0;
    var uuid = meta[0].uuid
    switch (Number(money.type)) {
      case 0:
        if (money.balance_time <= 0 || !money.balance_time) {
          access = false;
          status = "Error";
          break;
        }
        if (money.balance_time < 2) {
          status = "warning";
        };
        remain = money.balance_time * money.circle
        break;

      case 1:
        const curr = new Date();
        const expire = new Date(money.expire);
        const warn_expire = 1 * 1000 * 3600 * 24
        if (expire < curr || !expire) {
          access = false;
          status = "Error";
          break;
        }
        remain = Math.floor((expire - curr) / 86400000)
        if (expire - curr < warn_expire) {
          status = "warning";
        };
        break;
    }
    return res.json({
      code: 200,
      uuid: uuid,
      type: money.type,
      access: access,
      status: status,
      remain: remain,
      online: Boolean(meta[0].status)
    })
  })
});
router.get('/count',(req,res,next)=>{
  user.getCount(req,(err,rows)=>{
    if (err) {
      return res.json({
        code:500,
        err_msg:err
      })
    }
    return res.json({
      code:200,
      row_msg:rows
    })
  })
})
module.exports = router;
