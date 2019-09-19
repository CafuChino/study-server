var express = require('express');
const auth = require("../controller/auth");
const log =require("../controller/log")
var router = express.Router();

router.post('/login', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    log.logLogin(req,'尝试登陆后台，请求格式错误。')
    return res.json({
      code: 601,
      ret_msg: "请求格式错误！"
    })
  }
  auth.loginCheck(req, function (err, status, rows) {
    if (status) {
      if (status == 500) {
        log.logLogin(req,'尝试登陆后台，数据库查询错误。')
        return res.json({
          code: 500,
          ret_msg: "服务器出错，请稍后再试！",
          err_msg: err
        });
      } else {
        req.session.regenerate(function (err) {
          if (err) {
            log.logLogin(req,'尝试登陆后台，创建session错误。')
            return res.json({
              code: 501,
              ret_msg: '服务器异常，请稍后再试！'
            });
          };
          if (!rows || !rows.secret || !rows.access || !rows.uuid) {
            log.logLogin(req,'尝试登陆后台，账户元数据读取错误。')
            return res.json({
              code: 502,
              ret_msg: "数据库异常，请稍后再试",
              err_msg: err,
              row_msg:rows
            })
          }
          req.session.uuid = rows.uuid;
          req.session.access = rows.access;
          req.session.secret = rows.secret;
          req.session.loginUser = req.body.username;
          req.session.logged = true;
          log.logLogin(req,'尝试登陆后台，登陆成功。')
          return res.json({ code: 200, ret_msg: '登录成功!' });
        });
      }
    } else {
      log.logLogin(req,'尝试登陆后台，密码错误。')
      return res.json({ code: 600, ret_msg: '账户名或密码错误！' });
    }
  });
});
router.post('/register', function (req, res, next) {
  res.json({

  })
});
router.post('/pswdrst', function (req, res, next) {
  res.json({

  })
});
router.get('/ativite', function (req, res, next) {
  res.render('', {

  })
});
router.post('/logout', function (req, res, next) {
  if (req.session.loginUser && req.session.logged) {
    let currentUser = req.session.loginUser;
    req.session.loginUser = null;
    req.session.logged = false;
    log.logLogout(req,currentUser,'登出后台成功');
    return res.json({
      code: 200,
      ret_msg: currentUser + '成功登出！'
    })
  } else {
    log.logLogout(req,'过期session','异常登出后台操作，请核对ip');
    res.json({
      code: 400,
      ret_msg: '会话过期或状态异常，请重新登陆！'
    });
  }

})
router.get('/check', function (req, res, next) {
  return res.json({
    uuid: req.session.uuid,
    loginUser: req.session.loginUser,
    status: req.session.logged,
    access: req.session.access,
    secret: req.session.secret
  })
})
module.exports = router;
