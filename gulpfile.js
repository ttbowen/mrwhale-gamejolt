var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var mocha = require('gulp-mocha');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var cp = require('child_process');
var tsb = require('gulp-tsb');

gulp.task('less', function () {
    return gulp.src('./web/styles/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./lib/public/stylesheets'));
});

gulp.task('browser-sync', ['nodemon', 'watch'], function () {
    browserSync.init(null, {
        proxy: "http://localhost: 3000",
        files: ["lib/**/*.*", "lib/routes/**/*.*", "lib/public/**/*.*", "lib/views/**/*.*"],
        port: 7000,
    })
});

gulp.task('nodemon', function (cb) {
    var started = false;

    return nodemon({
        script: 'lib/www.js',
        watch: ['lib/*.js']
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function onRestart() {
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, 500);
    });
});

var tsConfigSrc = tsb.create('src/tsconfig.json');
gulp.task('build', function () {
    return gulp.src('./src/**/*.ts')
        .pipe(tsConfigSrc())
        .pipe(gulp.dest('./lib'));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.ts', ['build']);
    gulp.watch('src/styles/**/*.less', ['less']);
});

gulp.task('buildall', ['build', 'less']);
gulp.task('default', ['browser-sync']);