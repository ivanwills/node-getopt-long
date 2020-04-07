/* global require */

var gulp     = require('gulp');
var mocha    = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jshint   = require('gulp-jshint');
var sonar    = require('gulp-sonar');
var gutil    = require('gulp-util');

gulp.task('lint', gulp.series(function() {
    return gulp.src('./lib/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
}));

gulp.task('test', gulp.series(function() {
    return gulp.src(['lib/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(['test/*.js'], { read: false })
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .on('error', gutil.log);
        });
}));

gulp.task('sonar', gulp.series(function () {
    var options = {
        sonar: {
            host: {
                url: 'http://localhost:9000'
            },
            jdbc: {
                url: 'jdbc:postgresql://localhost/sonar',
                username: 'sonar',
                password: 'sonar'
            },
            projectKey: 'sonar:node-getopt-long',
            projectName: 'node-getopt-long',
            projectVersion: '0.2.5',
            // comma-delimited string of source directories
            sources: 'lib',
            language: 'js',
            sourceEncoding: 'UTF-8',
            javascript: {
                lcov: {
                    reportPath: 'coverage/locv.info'
                }
            }
        }
    };

    // gulp source doesn't matter, all files are referenced in options object above
    return gulp.src('lib/getopt-long.js', { read: false })
        .pipe(sonar(options))
        .on('error', gutil.log);
}));

gulp.task('watch', gulp.series(function() {
    gulp.watch(['lib/*.js', 'test/*.js'], gulp.series(['lint', 'test']));
}));
gulp.task('quality', gulp.series('lint', 'test', 'sonar'));
gulp.task('default', gulp.series('lint', 'test', 'watch'));
