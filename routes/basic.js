var express = require('express');
var basic = require('../controller/basic')
var log = require('../controller/log')
var router = express.Router();

/* GET home page. */
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
