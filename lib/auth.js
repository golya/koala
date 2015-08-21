'use strict';

module.exports.authed = function *authed(next){
    if (this.req.isAuthenticated()){
        yield next;
    } else {
        this.redirect('/login/');
    }
};

module.exports.logout = function *logout(next){
    this.req.logOut();
    yield next;
    this.redirect('/');
};

module.exports.serialize = function (user, done) {
    done(null, user.id);
};

module.exports.deserialize = function (id, done) {
    done(null, { id: 1, username: 'mail@mail.hu' })
};

module.exports.localUser = function (username, password, done){
    if (username == 'mail@mail.hu' && password == 'test') {
        done(null, { id: 1, username: 'mail@mail.hu' });
    } else {
        done(null, false);
    }
};