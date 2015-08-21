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
var auth = require('./lib/auth');
var app = module.exports = koa();

app.keys = ['0ef7803e-473a-11e5-9d62-126b7daeca32'];

//app.use(forceSSL());
app.use(logger());
app.use(bodyParser());
app.use(session(app));

app.use(passport.initialize());
app.use(passport.session());

//app.use(require('koa-livereload')());

app.use(router.routes());
app.use(router.allowedMethods());

passport.serializeUser(auth.serialize);
passport.deserializeUser(auth.deserialize);
passport.use(new LocalStrategy(auth.localUser));

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

router.get('/', auth.authed);

router.get('/login/', serve(path.join(__dirname, 'public/'), {index: 'login.html'}));
router.redirect('/login', '/login/');
router.post(
    '/auth',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login/' })
);
router.post('/logout', auth.logout);

var messages = require('./controllers/messages');
router.get('/messages', auth.authed, messages.list);
router.get('/messages/:id', auth.authed, messages.fetch);
router.post('/messages', auth.authed, messages.create);

