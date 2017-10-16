var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
global.version = require('./common/config').version //版本号
var log4js=require('log4js')

// log4js.configure({
//   appenders: [
//     { type: 'console' },{
//       type: 'file',
//       filename: 'logs/access.log',
//       maxLogSize: 1024,
//       backups:3,
//       category: 'normal'
//     }
//   ],
//   // replaceConsole: true
// });

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'logs/log.log',
      maxLogSize: 1024*10,
      backups:3,
      category: 'normal'
    }
  ],
  replaceConsole: true
});


var options = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'  ? {
  viewsPath: '../static',
  publicPath: '../static'
} : {viewsPath: '../webApp', publicPath: '../static'};

  // console.log(options);
global.config = require('./conf/'+process.env.NODE_ENV);
var index = require('./routes/index');
var users = require('./routes/users');
var detail = require('./routes/detail');
var products = require('./routes/products');
var contacts = require('./routes/contacts')
var profile = require('./routes/profile')
var search = require('./routes/search');
var blog = require('./routes/blog');

var app = express();

// var logger = log4js.getLogger('auto')
// app.use(log4js.connectLogger(logger, {level: 'auto', format:':method :url'}));

var logger = log4js.getLogger('normal');
logger.setLevel('debug');
app.use(log4js.connectLogger(logger, {level:log4js.levels.debug}));

const nativeLog = console.log;
console.log = function(){
  logger.info(arguments);
}


app.locals.domain = config.domain;
app.locals.apiHost = config.api_host;
app.locals.analyzeDomain = config.analyze_domain;
app.locals.serverApiHost = config.server_api_host;

// view engine setup
app.set('views', path.join(__dirname, options.viewsPath));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, options.publicPath),{maxAge:1000*60*60}));
app.use('/plugins', express.static(path.join(__dirname, '../node_modules'),{maxAge:1000*60*60}));
app.use('/', index);
app.use('/', express.static(path.join(__dirname, './rebot'),{maxAge:1000*60*60}));
app.use('/users', users);
app.use('/products', products);
app.use('/contacts', contacts);
app.use('/detail', detail);
app.use('/profile', profile);
app.use('/search', search)
app.use('/blog', blog)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('common/views/error');
});

module.exports = app;
