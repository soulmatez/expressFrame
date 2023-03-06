//用于生成和解析token
var jwt = require('jsonwebtoken');
var signkey = 'token_sign_x12345sxadadada';

function setToken(username, userid) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            name: username,
            _id: userid
        }, signkey, { expiresIn: '1h' });
        resolve(token);
    })
}

function verToken(token) {
    return new Promise((resolve, reject) =>
     {
        var info = jwt.verify(token.split(' ')[1], signkey);
        resolve(info);
    })
}

exports.default = {
    setToken, verToken, signkey
}