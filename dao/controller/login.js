const fs = require('fs')
const { userModel } = require('../model/system/user.js')
const { setToken } = require("../../utils/authotoken").default
const { setCaptcha } = require("../../utils/index").default
const { _pubkey, _prikey, decrypt } = require('../../utils/keyStore').default
const client = require('../../config/database').client
var logController = require('./system/log.js').default

//处理登录操作
const employee_login = async(req, res) => {
    let { username, password } = req.body;
    const data = await userModel.findOne({ 
        'user.userName': username, 
        'user.password': decrypt(_prikey, password)
    });
    if(data != null){
        if(data.user.status == '0'){
            res.json({
                code: 500,
                msg: "账户被管理员禁止登录，请联系管理员解除"
            })
        }
        // 生成token
        setToken(username, data._id).then(async (token) => {
            // 将token存储到redis
            client.set(token, data._id.toString(), function(err, res){
                client.expire(token, 60 * 60)
            })
            // 公共写入日志
            await logController.log_add_controller({
                uid: data._id,
                requestUrl: '/oauth/login',
                status: 200,
                requestMethod: req.method.toLowerCase(),
                requestHost: req.host,
                requestBody: {}
            }, 2)

            res.json({
                code: 200,
                msg: "登录成功",
                data: {
                    access_token: token,
                    token_type: 'token'
                }
            })
        })
        
    }else{
        res.json({
            code: 500,
            msg: "用户名或密码不正确"
        })
    }
        
    
}

//处理注册操作
const employee_sign = async (req, res) => {
    const data = await userModel.create(req.body)
    res.json(data)
}

//处理注销操作
const employee_logout = (req, res) => {
    client.get(req.headers['authorization'], async function(err, uid){
        // 公共写入日志
        await logController.log_add_controller({
            uid,
            requestUrl: 'logout',
            status: 200,
            requestMethod: req.method.toLowerCase(),
            requestHost: req.host,
            requestBody: {}
        }, 2)
        client.set(req.headers['authorization'], '', function(err, rs){
            client.expire(req.headers['authorization'], 0)
            res.json({
                code: 200,
                msg: "注销成功"
            })
        })
    })
    
}

//用户查询操作
const employee_find = async (req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    const data = await userModel.findOne(req.body)
    res.json({
        code: 200,
        msg: "登录成功",
        data
    })
}

//验证码获取
const employee_captcha = async (req, res) => {
    let { text, data } = setCaptcha()
    // text是指产生的验证码，data指svg的字节流信息
    res.type("svg")
    res.json({
        code: 200,
        data: {
            img: data,
            text: text,
            uuid: _pubkey
        }
    })
}

exports.default = {
    employee_login, employee_sign, employee_find, employee_logout, employee_captcha
}