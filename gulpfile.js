"use strict";

const gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cssnano = require("gulp-cssnano"),
    browserSync = require("browser-sync").create(),
    imagemin = require("gulp-imagemin"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    cache = require("gulp-cached"),
    del = require("del"),
    jsmin = require('gulp-jsmin'),
    rename = require('gulp-rename'),
    runSequence = require("run-sequence");

gulp.task("serve", function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});
gulp.task('scripts', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/popper.js/dist/umd/popper.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/owl.carousel/dist/owl.carousel.js'
        ])
        .pipe(gulp.dest('build/js'))
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/js'));
});
gulp.task("sass", function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(sass().on("error", sass.logError))
        .pipe(plumber.stop())
        .pipe(autoprefixer())
        .pipe(gulp.dest("build/css"))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});

gulp.task("html", function() {
	return gulp.src("src/*.html")
	.pipe(gulp.dest("build"));
});

// watch
gulp.task("watch", function() {
    gulp.watch("src/scss/**/*.scss", ["sass"]);
    gulp.watch("src/*.html", ['html']).on("change", browserSync.reload);
    gulp.watch("src/js/*.js", ['scripts']).on("change", browserSync.reload);
});

gulp.task("default", ["serve", "watch"]);
