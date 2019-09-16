var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var logRouter = require('./routes/log');
var authRouter = require('./routes/auth');
var moneyRouter = require('./routes/money');
var statusRouter = require('./routes/status');

var app = express();
var identityKey = 'skey';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    name: identityKey,
    secret: 'chyingp',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 24 * 60 * 60 * 1000  // 有效期，单位是毫秒
    }
}));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/log', logRouter);
app.use('/auth', authRouter);
app.use('/money', moneyRouter);
app.use('/status', statusRouter);

module.exports = app;
