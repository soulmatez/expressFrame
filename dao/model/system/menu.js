// const mongoose = require('mongoose');
const { ObjectId, Timestamp } = require('mongodb');
const { Schema, model } = require('mongoose');

//Schema这个方法是一个构造函数,通过new创建这个构造方法的实例对象
// 这个方法用于定义数据库列名和值的类型
// 1.定义数据集合的结构:定义出集合中数据有哪些属性，属性的值是什么类型。
const menuSchema = new Schema({
    name: String,
    path: String,
    component: String,
    redirect: String,
    meta: Object,
    children: Array,
    parentId: String
})

//2.定义数据集合的模型,将Schema和数据库中的集合关联起来
//model参数一:模型名称
//参数二:为上面的usersSchema
//参数三:数据库中的集合名称
const menuModel = model('menumodel', menuSchema, 'menu')

//向外导出模型
module.exports.menuModel = menuModel;