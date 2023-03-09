var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs')

require('./config/database.js')
const client = require('./config/database').client

var loginRouter = require('./routes/login');
var menuRouter = require('./routes/system/menu');
var indexRouter = require('./routes/system/index');
var usersRouter = require('./routes/system/users');
var rolesRouter = require('./routes/system/roles');
var deptsRouter = require('./routes/system/depts');
var dictsRouter = require('./routes/system/dicts');

var app = express();
app.use(cookieParser())

//  注意app.all要写在  app.use之前
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  //30s
  res.header('Cache-Control', 'no-cache');
  //兼容低版本, 到什么时间结束
  //res.header('Expires', new Date(Date.now() + 10 * 1000).toUTCString());
  
  // 设置路由白名单，免除jwt权限校验
  var whiteRouterList = [
    '/oauth/captchaImage', 
    '/oauth/login'
  ];
  // 获取当前访问的api地址
  const url = req._parsedUrl.pathname;
  if (whiteRouterList.indexOf(url) >= 0) {
    next()
    return false
  }
  // 获取token
  var token = req.headers['authorization'];
  if(token == undefined){
    res.status(401).json({
      code: 401
    }) 
  }else{
    client.get(token, function(err, data){
      if(data != null){
        // 延期token
        client.set(token, data, function(err, suc){
          client.expire(token, 60 * 60)
        })
        next();

        // 公共写入日志
        // res.on('finish', (err) => {
        //   client.get(req.headers['authorization'], async function(err, uid){
        //     console.log(uid)
        //     console.log(`request for ${req.baseUrl}${req.url} finished with status ${res.statusCode}`);
        //   })
        // });

        //响应超时处理
        // res.on('timeout', function(){
        //   console.log('服务器繁忙')
        // })
        // res.setTimeout(3000)  //设置超时的时间
      }else{
        res.status(401).json({
          code: 402,
          msg: '用户状态异常，请重新登录！'
        })  
      }
    })
  } 
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//修改视图为html文件
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/oauth', loginRouter);
app.use('/menus', menuRouter);
app.use('/roles', rolesRouter);
app.use('/depts', deptsRouter);
app.use('/dicts', dictsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

app.use((req, res, next) => {
  // listen for when the request is done
  
});

module.exports = app;
