var express = require('express');
var auth = require("../controller/auth");
var router = express.Router();

router.post('/login', function (req, res, next) {
  auth.loginCheck(req, function (err, status) {
    if (status) {
      if (status == 500) {
        return res.json({
          code: 500,
          message: "服务器出错，请稍后再试！"
        });
      } else {
        req.session.regenerate(function (err) {
          if (err) {
            return res.json({
              code: 501,
              ret_msg: '网络异常，请稍后再试！'
            });
          }
          req.session.loginUser = req.body.username;
          res.json({ code: 200, ret_msg: '登录成功!' });
        });
      }
    } else {
      res.json({ code: 600, ret_msg: '账户名或密码错误！' });
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
module.exports = router;
