"use strict";

const gulp = require("gulp");
const concat = require("gulp-concat");
const debug = require("gulp-debug");
const autoprefixer = require("gulp-autoprefixer");
const remember = require("gulp-remember");
const stylus = require("gulp-stylus");
const cached = require("gulp-cached");
const path = require("path");

gulp.task("styles", function () {
  return gulp
    .src(
      "frontend/styles/**/*.styl"
    ) /*{since: gulp.lastRun("styles"),} // mtime }*/
    .pipe(cached("styles")) // content
    .pipe(remember("styles"))
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(concat("all.css"))
    .pipe(gulp.dest("public"));
});

gulp.task("watch", function () {
  gulp
    .watch("frontend/styles/**/*.styl", gulp.series("styles"))
    .on("unlink", function (filepath) {
      remember.forget("styles", path.resolve(filepath));
      delete cached.caches.styles[path.resolve(filepath)];
    });
});

gulp.task("dev", gulp.series("styles", "watch"));
