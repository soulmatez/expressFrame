const { connect, connection } = require('mongoose');
const redis = require("redis");
const config = require('../package.json');


/**
 * MongoDb 数据库配置
 */
// 设置要连接的 MongoDB 服务器地址(studentsManage:要连接的数据库名称)
const dbURI = `${config.db.mongodb.url}/${config.db.mongodb.dbname}`;

// 连接数据库
connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

//当数据库连接成功时触发此事件
connection.on('connected', () => console.log('\033[40;32m MongoDB Sever is Running Success\033[0m'));


/**
 * Redis 数据库配置
 */
//创建一个redis链接
// format redis[s]://[[username][:password]@][host][:port][/db-number]:
const client = redis.createClient({
    url: `${config.db.redis.url}`,
});

//监听错误事件
client.on("error", (err) => {
    console.log("redis error", err);
});
 
client.auth(config.db.redis.auth, function() {
    // console.log("redis auth ok");
});
 
client.on('connect', function() {
    console.log('\033[40;32m Redis Sever is Running Success\033[0m')
});
 
client.on('ready', function() {
    // console.log("redis ready ok");
});

function setRedisValue(){
    // 设置redis
    client.set(key, value, redis.print);
}

function getRedisValue(_key, callback){
    return new Promise((resolve, reject)=>{
        // 读取redis
        client.get(key, function(err, reply) {})
    })
}

exports.client = client;