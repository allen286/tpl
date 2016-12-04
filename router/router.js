const router = require('koa-router')();

module.exports = function(app) {
    app.use(router.routes());

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
}