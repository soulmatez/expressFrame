// const mongoose = require('mongoose');
const { ObjectId, Timestamp } = require('mongodb');
const { Schema, model } = require('mongoose');
const { format } = require("../../../utils/index").default

//Schema这个方法是一个构造函数,通过new创建这个构造方法的实例对象
// 这个方法用于定义数据库列名和值的类型
// 1.定义数据集合的结构:定义出集合中数据有哪些属性，属性的值是什么类型。
const logSchema = new Schema({
    systemCode: String,
    handleType: Number,
    postType: String,
    handleUserId: String,
    handleUser: String,
    handleHost: String,
    handleLocal: String,
    handleStatus: Number,
    handleTime: { type: Date, default: Date.now },
    handleDesc: String,
    handBody: Object
})

//2.定义数据集合的模型,将Schema和数据库中的集合关联起来
//model参数一:模型名称
//参数二:为上面的usersSchema
//参数三:数据库中的集合名称
const logModel = model('logmodel', logSchema, 'log')

//向外导出模型
module.exports.logModel = logModel;