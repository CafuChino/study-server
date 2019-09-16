//严格检查字符串，不允许任何特殊字符，包括邮箱
var strictCheck = function (s) {
    // 去掉转义字符
    s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
    // 去掉特殊字符
    s = s.replace(/[\'\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]\=]/, '');
    // 去除空格
    s = s.replace(' ', '');
    return s;
}
//普通过滤字符串，放行了邮箱和少量危害较低的字符
var primaryCheck = s => {
    // 去掉转义字符
    s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
    // 去掉特殊字符
    s = s.replace(/[\'\#\^\&\(\)\{\}\:\"\L\<\>\?\[\]\=]/, '');
    // 去除空格
    s = s.replace(' ', '');
    return s;
}
//检查是否为邮箱
//TODO:添加邮箱域名黑名单审计
var emailCheck = s => {
    s = primaryCheck(s)
    patten = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return Boolean(s.match(patten));
}

exports.strictCheck = strictCheck
exports.primaryCheck = primaryCheck
exports.emailCheck = emailCheck