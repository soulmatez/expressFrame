// const mongoose = require('mongoose');
const { ObjectId, Timestamp } = require('mongodb');
const { Schema, model } = require('mongoose');
const { format } = require("../../../utils/index").default

//Schema这个方法是一个构造函数,通过new创建这个构造方法的实例对象
// 这个方法用于定义数据库列名和值的类型
// 1.定义数据集合的结构:定义出集合中数据有哪些属性，属性的值是什么类型。
const userSchema = new Schema({
    // permissions: Array,
    // roles: Array,
    roleIds: String,
    user: {
        updateBy: String,
        createBy: String,
        createTime: { type: String, default: format('YYYY-MM-DD HH:mm:ss') },
        updateTime: {type: String, default: format('YYYY-MM-DD HH:mm:ss')},
        remark: { type: String, default: "这是我的remark" },
        deptId: String,
        userName: String,
        nickName: String,
        email: String,
        sex: String,
        phonenumber: String,
        status: String,
        loginIp: String,
        loginDate: {type: String, default: format('YYYY-MM-DD HH:mm:ss')},
        dept: Object,
        password: {type: String, default: '123456'},
        avatar: {type: String, default: "http://580.wcname.cn/static/img/profile.7f02b7ee.jpeg"},
    }
})

//2.定义数据集合的模型,将Schema和数据库中的集合关联起来
//model参数一:模型名称
//参数二:为上面的usersSchema
//参数三:数据库中的集合名称
const userModel = model('usermodel',userSchema,'user')

//向外导出模型

module.exports.userModel = userModel;