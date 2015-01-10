var gulp   = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
    console.log('here');
    return gulp.src('./lib/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
