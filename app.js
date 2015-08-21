'use strict';

var koa = require('koa');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var router = require('koa-router')();

var passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;

var http = require('http');
var https = require('https');
//var forceSSL = require('koa-force-ssl');

var fs = require('fs');
var path = require('path');

var app = module.exports = koa();

app.keys = ['0ef7803e-473a-11e5-9d62-126b7daeca32'];

//app.use(forceSSL());
app.use(logger());
app.use(bodyParser());
app.use(session(app));

app.use(passport.initialize());
app.use(passport.session());

function *authed(next){
    if (this.req.isAuthenticated()){
        yield next;
    } else {
        this.redirect('/login/');
    }
}

function *logout(next){
    console.log('logoooooout');
    this.req.logOut();
    yield next;
    this.redirect('/');
}

//app.use(require('koa-livereload')());

app.use(router.routes());
app.use(router.allowedMethods());

//auth

var serialize = function (user, done) {
    done(null, user.id);
};

var deserialize = function (id, done) {
    done(null, { id: 1, username: 'mail@mail.hu' })
};

var localUser = function (username, password, done){
    if (username == 'mail@mail.hu' && password == 'test') {
        done(null, { id: 1, username: 'mail@mail.hu' });
    } else {
        done(null, false);
    }
};

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);
passport.use(new LocalStrategy(localUser));

// Serve static files
app.use(serve(path.join(__dirname, 'public/login')));
app.use(serve(path.join(__dirname, 'public/www')));

// Compress
app.use(compress());

if (!module.parent) {
    // SSL options
    var options = {
        key: fs.readFileSync('./test_certs/test.key'),
        cert: fs.readFileSync('./test_certs/test.cert')
    };

    var port = 3000;
    //app.listen(port);
    http.createServer(app.callback()).listen(port);
    //https.createServer(options, app.callback()).listen(443);
    console.log('listening on port', port);
}

router.get('/', authed);

router.get('/login/', serve(path.join(__dirname, 'public/'), {index: 'login.html'}));
router.redirect('/login', '/login/');
router.post(
    '/auth',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login/' })
);
router.post('/logout', logout);

var messages = require('./controllers/messages');
router.get('/messages', authed, messages.list);
router.get('/messages/:id', authed, messages.fetch);
router.post('/messages', authed, messages.create);

