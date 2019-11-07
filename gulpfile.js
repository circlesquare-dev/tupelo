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

gulp.task("serve", ["sass"], function() {
    browserSync.init({
        server: {
            baseDir: "./src"
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
        .pipe(gulp.dest('src/js'))
});
gulp.task("sass", function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(sass().on("error", sass.logError))
        .pipe(plumber.stop())
        .pipe(autoprefixer())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});


// build
gulp.task("build:img", function() {
    gulp.src("src/images/*")
        .pipe(cache(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ])))
        .pipe(gulp.dest("build/images"))
});
gulp.task("build:css", function() {
    return gulp.src("src/css/*.css")
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("build/css"))
});
gulp.task("build:fonts", function() {
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest("build/fonts"));
});
gulp.task("build:icons", function() {
    return gulp.src("src/icons/*")
        .pipe(gulp.dest("build/icons"));
});
gulp.task("build:js", function() {
    return gulp.src('src/js/*.js')
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/js'));
});
gulp.task("build:html", function() {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("build"));
});
gulp.task("clean", function() {
    return del("build");
});

var callback = function() {};
gulp.task("build", function(callback) {
    runSequence("clean", [
    "build:css",
    "build:fonts",
    "build:js",
    "build:html",
    "build:img",
    "build:icons"
], callback);
});
// watch
gulp.task("watch", function() {
    gulp.watch("src/scss/**/*.scss", ["sass"]);
    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/js/*.js").on("change", browserSync.reload);
});

gulp.task("default", ["serve", "watch"]);
