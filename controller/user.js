const mysql = require('mysql');
const db = require("../config/db");
const waf = require("../config/waf");
const md5 = require("js-md5");
const uuidv1 = require('uuid/v1');

function addUserStudent(req, callback) {
    db.mysqlDate((date, time) => {
        if (req.body.name && req.body.gender) {
            let cardID = '',
                unit = '',
                className = '',
                classID = '',
                tel = '',
                er_tel = '',
                addr = '',
                balance_credit = 0,
                balance_time = 0;
            let name = mysql.escape(waf.strictCheck(req.body.name));
            let admin = mysql.escape(req.session.loginUser);
            balance_time = mysql.escape(req.body.balance_time);
            balance_credit = mysql.escape(req.body.balance_credit);
            let circle = mysql.escape(req.body.circle);
            let expire = mysql.escape(req.body.expire);
            let gender = req.body.gender;
            let uuid = mysql.escape(uuidv1());
            let reg_time = date.toString() + time.toString();
            if (req.body.cardID) {
                cardID = mysql.escape(req.body.cardID);
            };
            if (req.body.unit) {
                unit = mysql.escape(waf.strictCheck(req.body.unit))
            };
            if (req.body.className) {
                className = mysql.escape(req.body.className)
            };
            if (req.body.classID) {
                classID = mysql.escape(req.body.classID)
            };
            if (req.body.tel) {
                tel = mysql.escape(req.body.tel)
            };
            if (req.body.er_tel) {
                er_tel = mysql.escape(req.body.er_tel)
            };
            if (req.body.addr) {
                addr = mysql.escape(waf.primaryCheck(req.body.addr))
            };
            let sql1 = `INSERT INTO student_meta (uuid,cardID,reg_admin,reg_time) VALUES (${uuid},${cardID},${admin},${reg_time})`;
            let sql2 = `INSERT INTO student_basic (uuid,name,gender,unit,className,classID,tel,er_tel,addr) VALUES (${uuid},${name},${gender},${unit},${className},${classID},${tel},${er_tel},${addr})`;
            let sql3 = `INSERT INTO student_money (uuid,balance_time,balance_credit,circle,expire) VALUES (${uuid},${balance_time},${balance_credit},${circle},${expire})`;
            db.query(sql1, function (err, rows) {
                if (err) {
                    return callback(err, rows)
                }
                db.query(sql2, (err, rows) => {
                    if (err) {
                        return callback(err, rows)
                    }
                    db.query(sql3, function (err, rows) {
                        return callback(err, rows)
                    })
                })
            })
        } else {
            let err = "Request Error"
            return callback(err)
        }
    })
};

function freezeUserStudent(req, callback) {
    if (req.session.access >= 2 && req.session.logged && req.body.secret == req.session.secret) {
        if (!req.body.uuid) {
            let err = 'Request Error';
            return callback(err);
        }
        uuid = req.body.uuid;
        let checkSql = `SELECT * FROM student_meta WHERE uuid=${mysql.escape(uuid)}`
        let freezeSql = `UPDATE student_meta SET status=2 WHERE uuid=${mysql.escape(uuid)}`
        let unfreezeSql = `UPDATE student_meta SET status=0 WHERE uuid=${mysql.escape(uuid)}`
        db.query(checkSql, (err, rows) => {
            if (err) {
                return callback(err, rows);
            };
            if (rows.length == 0) {
                let err = 'Student Not Found Error';
                return callback(err, rows)
            }
            if (rows[0].status == 2) {
                db.query(unfreezeSql, (err, rows) => {
                    return callback(err, rows)
                })
            } else {
                db.query(freezeSql, (err, rows) => {
                    callback(err, rows)
                })
            }

        })
    } else {
        let err = 'Access Denied'
        return callback(err)
    }
};

function getStudentBasic(req, callback) {
    if (!req.session.logged || !req.session.loginUser || !req.session.access) {
        let err = "Access Denied";
        return callback(err)
    }
    const type = req.query.type;
    const info = req.query.info;
    const typeArray = ['uuid', 'name', 'gender', 'unit', 'className', 'classID', 'tel', 'er_tel', 'addr']
    if (typeArray.indexOf(type) == -1) {
        let err = "Serch Type Error"
        return callback(err);
    };
    if (!info) {
        let err = "Request Need Info";
        return callback(err)
    };
    const sql = `SELECT * FROM student_basic WHERE ${type} LIKE ${mysql.escape('%' + info + '%')}`
    db.query(sql, (err, rows) => {
        callback(err, rows)
    })
}

function getStudentMeta(req, callback) {
    if (!req.session.logged || !req.session.loginUser || !req.session.access) {
        let err = "Access Denied";
        return callback(err)
    }
    const type = req.query.type;
    const info = req.query.info;
    const typeArray = ['uuid', 'cardID', 'reg_admin', 'reg_time', 'status']
    if (typeArray.indexOf(type) == -1) {
        let err = "Serch Type Error"
        return callback(err);
    };
    if (!info) {
        let err = "Request Need Info";
        return callback(err)
    };
    const sql = `SELECT * FROM student_meta WHERE ${type} LIKE ${mysql.escape('%' + info + '%')}`
    db.query(sql, (err, rows) => {
        callback(err, rows)
    })
}

function getStudentInformation(req, callback) {
    if (!req.session.logged || !req.session.loginUser || !req.session.access || !req.query.uuid) {
        let err = "Access Denied";
        return callback(err)
    };
    const uuid = mysql.escape(req.query.uuid);
    const sql = `SELECT * FROM student_money WHERE uuid=${uuid}`
    db.query(sql, (err, rows) => {
        if (err) {
            return callback(err);
        };
        var money_row = rows
        let sql = `SELECT * FROM student_meta WHERE uuid=${uuid}`;
        db.query(sql, (err, rows) => {
            if (err) {
                return callback(err);
            };
            return callback(err,money_row,rows)
        })
    })

}
exports.addUserStudent = addUserStudent
exports.freezeUserStudent = freezeUserStudent
exports.getStudentBasic = getStudentBasic
exports.getStudentMeta = getStudentMeta
exports.getStudentInformation = getStudentInformation