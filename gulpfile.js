'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    ngmin = require('gulp-ngmin'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    bower = require('gulp-bower'),
    jshint = require('gulp-jshint'),
    gulpSync = require('gulp-sync'),
    sync = gulpSync(gulp).sync;


// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

var server = express();

server.use(livereload({port: livereloadport}));
server.use(express.static('./dist'));
server.all('/*', function(req, res) {
    res.sendfile('index.html', { root: 'dist' });
});


gulp.task('build', sync(['clean', 'views', 'vendors', 'css', 'js']), function() { });


gulp.task('js', function() {
    // Single point of entry (browserify will figure the rest out)
    gulp.src(['src/js/app.js'])
        .pipe(browserify({
            debug: true
        }))
        .on('error', gutil.log)
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.init())
        .pipe(ngmin())                      // For Explicit annotation additional setting - ({dynamic: true}))
        .pipe(uglify({mangle: false}))      // omit variable names
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('vendors', function() {
    gulp.src([
        'bower_components/angular/angular.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js'
    ])
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/vendors'));
});

gulp.task('views', function() {
    gulp.src('./src/index.html')
        .pipe(gulp.dest('dist/'));

    gulp.src('./src/views/**/*')
        .pipe(gulp.dest('dist/views/'));
});

gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean());
});

gulp.task('css', function() {
    return gulp.src('./src/css/*.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                './bower_components/bootstrap-sass/assets/stylesheets'
            ],
            sourceMap: true
        }).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('hint', function() {
    return gulp.src(['src/js/*.js', 'src/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', ['hint'],  function() {
    // Start webserver
    server.listen(serverport);
    // Start live reload
    refresh.listen(livereloadport);

    gulp.watch(['src/js/*.js', 'src/js/**/*.js'],[
        'js'
    ]);

    gulp.watch(['src/*.html'], [
        'views'
    ]);

    gulp.watch(['./src/css/*.scss'], [
        'css'
    ]);

    gulp.watch('./dist/**').on('change', refresh.changed);

});

gulp.task('bower', function() {
    return bower();
});

gulp.task('default', sync(['bower','build', 'watch']));