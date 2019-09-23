let mysql = require('mysql');
var db = require("../config/db");

function basicSign(req, callback) {
    if (!req.session.logged || !req.session.loginUser||req.session.logged ==null) {
        return callback("Session Failed");
    };
    const actionList = ['signIn', 'signOut']
    var err = false
    let action = req.body.action;
    db.mysqlDate((date, time) => {
        const signTime = mysql.escape(date.toString() + time.toString())
        let cardID = mysql.escape(req.body.cardID);
        if (!cardID || cardID == 'NULL' || cardID == 0 || cardID == null) {
            return callback('Card Error')
        }
        if (actionList.indexOf(action) == -1) {
            return callback("Request Error");
        }
        if (action == 'signIn') {
            sql2 = `UPDATE student_meta SET status=1,last_login=${signTime} WHERE cardId=${cardID}`
        } else {
            sql2 = `UPDATE student_meta SET status=0,last_logout=${signTime} WHERE cardId=${cardID}`
        }
        let sql1 = `SELECT * FROM student_meta WHERE cardId=${cardID}`;
        db.query(sql1, function (err, rows) {
            let uuid
            if (err) {
                return callback(err, rows)
            };
            if (rows.length != 1) {
                err = "Card Error"
            } else {
                uuid = rows[0].uuid
                if (rows[0].status == 2) {
                    err = 'Card Frozen'
                } else {
                    if (rows[0].status == 1 && action == 'signIn') {
                        err = "User Already Online"
                    } else {
                        if (rows[0].status == 0 && action == 'signOut') {
                            err = "User Already Offline"
                        }
                    }
                }
            };
            if (err) {
                return callback(err, uuid, date,time);
            } else {
                db.query(sql2, function (err, rows) {
                    return callback(err, uuid, date,time);
                })
            }

        })
    })
}

exports.basicSign = basicSign