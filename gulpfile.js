var gulp = require('gulp');
var mocha = require('gulp-mocha');

var paths = {
    controllers: 'controllers/*.js',
    lib: 'lib/*.js',
    model: 'model/*.js',
    test: 'test/*.js'
};

gulp.task('test', function () {
    return gulp.src('test/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', function() {
    gulp.watch(paths.controllers, ['test']);
    gulp.watch(paths.lib, ['test']);
    gulp.watch(paths.model, ['test']);
    gulp.watch(paths.test, ['test']);
});