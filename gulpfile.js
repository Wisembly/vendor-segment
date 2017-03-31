var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', function () {
    gulp.start('scripts');
});

gulp.task('scripts', function () {
    return gulp.src('src/segment.js')
        .pipe(gulp.dest('dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
