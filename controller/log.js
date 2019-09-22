let mysql = require('mysql');
var db = require("../config/db");
function logLogin(req, info) {
    db.mysqlDate((date, time) => {
        sql = `INSERT INTO log_admin (date,time,admin,info,ip) VALUES (${date},${time},${mysql.escape(req.body.username)},${mysql.escape(info)},${mysql.escape(req.ip)})`;
        db.query(sql, (err, rows) => {
        })
    })
}
function logLogout(req, name, info) {
    db.mysqlDate((date, time) => {
        sql = `INSERT INTO log_admin (date,time,admin,info,ip) VALUES (${date},${time},${mysql.escape(name)},${mysql.escape(info)},${mysql.escape(req.ip)})`;
        db.query(sql, (err, rows) => {
        })
    })
}
function primaryAdminLog(req,info) {
    db.mysqlDate((date, time) => {
        let user = "未知"
        if (req.session.loginUser) {
            user = req.session.loginUser
        }
        sql = `INSERT INTO log_admin (date,time,admin,info,ip) VALUES (${date},${time},${mysql.escape(user)},${mysql.escape(info)},${mysql.escape(req.ip)})`;
        db.query(sql, (err, rows) => {
        })
    })
}

exports.logLogin = logLogin;
exports.logLogout = logLogout;
exports.primaryAdminLog = primaryAdminLog;