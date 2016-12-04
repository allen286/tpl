'use strict'

const koa = require('koa');
const path = require('path');
const logger = require('koa-logger2');
const fs = require('fs');
const favicon = require('koa-favicon');
const body = require('koa-better-body')
const render = require('koa-ejs');
const error = require('koa-error');
const serve = require('koa-static-server');
const router = require('./router/router');

const port = process.env.PORT || 3001

let app = koa();
let log_middleware = logger('ip [day/month/year:time zone] "method url protocol/httpVer" status size "referer" "userAgent" duration ms custom[unpacked]');
log_middleware.setStream(fs.createWriteStream(path.join(__dirname, 'log/2016-11-29.log'), {
  flags: 'a'
}))

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

router(app);

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