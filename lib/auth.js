var User = require("../model/user");

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

module.exports.localUser = function localUser(username, password, done){
    User.findOne({username: username, password: password},
        function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.password != password) {
                return done(null, false);
            }

            console.log(user);

            return done(null, user);
        }
    );
};