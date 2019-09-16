let mysql = require('mysql');
var db = require("../config/db");
var waf = require("../config/waf");
var md5 = require("js-md5");
var async = require('async');
function makeLoginSql(req,callback) {
    var username = req.body.username;
    let sql = '';
    if (waf.emailCheck(username)) {
        sql = 'SELECT * FROM user_admin WHERE email=' + mysql.escape(username);
    } else {
        username = waf.strictCheck(username);
        sql = 'SELECT * FROM user_admin WHERE username=' + mysql.escape(username);
    };
    callback(sql)
}
function loginCheck(req, callback) {
    var password = req.body.password;
    makeLoginSql(req,function(sql) {
        db.query(sql, function (err, rows) {
            if (err) {
                status = 500;
                throw err;
            } else {
                if (+rows.length) {
                    if (rows[0].password == md5(md5(password) + '3721')) {
                        status = 200;
                    } else {
                        status = false;
                    }
                } else {
                    status = false;
                }
            }
            callback(err,status);
        });
    })
}

exports.loginCheck = loginCheck