module.exports = {
    '/': function*(){
        yield this.render('index', {
            h_title: 'koa demo'
        });
    }
}