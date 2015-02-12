var gulp     = require('gulp');
var mocha    = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jshint   = require('gulp-jshint');
var gutil    = require('gulp-util');

gulp.task('lint', function() {
    console.log('here');
    return gulp.src('./lib/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function(cb) {
    return gulp.src(['lib/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(['test/*.js'], { read: false })
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .on('error', gutil.log);
        });
});

gulp.task('watch', function() {
    gulp.watch(['lib/**', 'test/**'], ['lint', 'test']);
});
