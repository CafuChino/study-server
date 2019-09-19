const mysql = require('mysql');
const db = require("../config/db");
const waf = require("../config/waf");
const md5 = require("js-md5");
const uuidv1 = require('uuid/v1');

function addUserStudent(req, callback) {
    db.mysqlDate((date,time)=>{
        if (req.body.name && req.body.gender) {
            let cardID = '', unit = '', className = '', classID = '', tel = '', er_tel = '', addr = '';
            let name = mysql.escape(waf.strictCheck(req.body.name));
            let admin = mysql.escape(req.session.loginUser);
            let gender = req.body.gender;
            let uuid = mysql.escape(uuidv1());
            let reg_time = date.toString()+time.toString();
            if (req.body.cardID) { cardID = mysql.escape(req.body.cardID); };
            if (req.body.unit) { unit = mysql.escape(waf.strictCheck(req.body.unit)) };
            if (req.body.className) { className = mysql.escape(req.body.className) };
            if (req.body.classID) { classID = mysql.escape(req.body.classID) };
            if (req.body.tel) { tel = mysql.escape(req.body.tel) };
            if (req.body.er_tel) { er_tel = mysql.escape(req.body.er_tel) };
            if (req.body.addr) { addr = mysql.escape(waf.primaryCheck(req.body.addr)) };
            let sql1=`INSERT INTO student_meta (uuid,cardID,reg_admin,reg_time) VALUES (${uuid},${cardID},${admin},${reg_time})`
            let sql2 = `INSERT INTO student_basic (uuid,name,gender,unit,className,classID,tel,er_tel,addr) VALUES (${uuid},${name},${gender},${unit},${className},${classID},${tel},${er_tel},${addr})`;
            db.query(sql1,function(err,rows) {
                if (err) {
                    return callback(err,rows)
                }
                db.query(sql2,(err,rows)=>{
                    return callback(err,rows)
                })
            })
        } else {
            let err = "Request Error"
            return callback(err)
        }
    })
}

exports.addUserStudent = addUserStudent