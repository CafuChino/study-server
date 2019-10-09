var express = require('express');
var basic = require('../controller/basic')
var log = require('../controller/log')
var router = express.Router();

/* GET home page. */
router.all('*', function (req, res, next) {
    //TODO:上线之前把跨域修复了
  res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Cache-Control", "no-store");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });
router.post('/sign', function (req, res, next) {
    console.log(req.session.admin)
    basic.basicSign(req,(err,uuid,date,time)=>{
        console.log(uuid)
        if (err) {
            return res.json({
                code:500,
                err_msg:err
            })
        }
        log.primarySignLog(req,uuid,date,time)
        return res.json({
            code:200,
            row_msg:uuid
        })
    })
});
module.exports = router;
