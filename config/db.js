let mysql = require('mysql');
let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "study_panel"
});
function mysqlDate(callback) {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    if (month.toString().length==1) {
        month = '0'+month;
    };
    let day = date.getDate();
    if (day.toString().length==1) {
        day = '0'+day;
    };
    let hour = date.getHours();
    if (hour.toString().length==1) {
        hour = '0'+hour;
    };
    let minute = date.getMinutes();
    if (minute.toString().length==1) {
        minute = '0'+minute;
    };
    let second = date.getSeconds();
    if (second.toString().length==1) {
        second = '0'+second;
    };
     const dateStr = `${year}${month}${day}`;
     const timeStr = `${hour}${minute}${second}`;
     callback(dateStr,timeStr)
}
function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        connection.query(sql, function (err, rows) {
            callback(err, rows);
            connection.release();
        });
    });
};
exports.query = query;
exports.mysqlDate = mysqlDate;