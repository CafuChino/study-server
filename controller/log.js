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
function primaryAdminLog(req, info) {
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
function primarySignLog(req, uuid, date, time) {
    let admin = mysql.escape(req.session.loginUser)
    let action = mysql.escape(req.body.action)
    sql = `SELECT * FROM student_basic WHERE uuid=${mysql.escape(uuid)}`
    db.query(sql, (err, rows) => {
        let name = mysql.escape(rows[0].name);
        if (!uuid) {
            uuid = "未知"
        };
        if (!name) {
            name = '未知'
        }
        let sql = `INSERT INTO log_student (name,uuid,date,time,action,admin) VALUES (${name},${mysql.escape(uuid)},${date},${time},${action},${admin})`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
        })
    })
}
exports.logLogin = logLogin;
exports.logLogout = logLogout;
exports.primaryAdminLog = primaryAdminLog;
exports.primarySignLog = primarySignLog;