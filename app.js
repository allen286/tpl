'use strict'

const port = process.env.PORT || 3001

const koa = require('koa');
let app = koa();

const path = require('path');

const logger = require('koa-logger2');
const fs = require('fs');
let log_middleware = logger('ip [day/month/year:time zone] "method url protocol/httpVer" status size "referer" "userAgent" duration ms custom[unpacked]');
log_middleware.setStream(fs.createWriteStream(path.join(__dirname, 'log/2016-11-29.log'), {
  flags: 'a'
}))

const favicon = require('koa-favicon');
// const route = require('koa-route');
const router = require('koa-router')();
const body = require('koa-better-body')
const render = require('koa-ejs');
const error = require('koa-error');
const serve = require('koa-static-server');

// 网站小图标
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

// logger中间件
app.use(log_middleware.gen);

// koa-ejs的render设置
render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
});

// koa-router的使用
router.get('/', function*(next) {
  yield this.render('index', {
    h_title: 'koa demo'
  });
}).get('/user/:username', function*(next) {
  let username = this.params.username;
  console.log(username);
  yield this.render('user', {
    user: username,
    h_title: 'error'
  });
}).get('/user', function*(next) {
  // koa原生支持重定向
  this.redirect('/');
});
// 利用router实现重定向
router.redirect('/index', 'index');
// router
app
  .use(router.routes())
  .use(router.allowedMethods());

// koa-route；route与router两者之间区别是？ 
// app.use(route.get('/','/user', function*() {
//   yield this.render('index');
// })).use(route.get('/user/:user', function*(user) {
//   console.log(user);
//   yield this.render('user', {
//     user: user
//   });
// }));

// koa-better-body
app
  .use(body())
  .use(function*() {
    console.log(this.body)
  });

// 错误页
app.use(error({
  template: path.join(__dirname, 'view/error.html')
}));

// 静态文件管理
app.use(serve({
  rootDir: 'static',
  rootPath: '/static'
})).use(serve({
  rootDir: 'www',
  rootPath: '/'
}));

app.listen(port, function() {
  console.log('started at %s:  - port:%s', new Date, port)
})