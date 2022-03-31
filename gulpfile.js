'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const multipipe = require('multipipe');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function () {
  return multipipe(
    gulp.src('frontend/**/*.styl'),

    gulpIf(isDevelopment, sourcemaps.init()),
    stylus(),
    concat('all.css'),
    gulpIf(isDevelopment, sourcemaps.write()),
    gulp.dest('public'),
  ).on(
    'error',

    notify.onError(function (err) {
      return {
        title: 'Styles',
        message: err.message,
      };
    }),
  );

  // gulp
  //   .src('frontend/**/*.styl')
  //   .pipe(
  //     plumber({
  //       errorHandler: notify.onError(function (err) {
  //         return {
  //           title: 'Styles',
  //           message: err.message,
  //         };
  //       }),
  //     }),
  //   )
  //   .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  //   .pipe(stylus())

  //   .pipe(concat('all.css'))
  //   .pipe(gulpIf(isDevelopment, sourcemaps.write()))
  //   .pipe(gulp.dest('public'));
});

gulp.task('clean', function () {
  return del('public');
});

gulp.task('assets', function () {
  return gulp
    .src('frontend/assets/**')
    .pipe(newer('public'))
    .pipe(debug({ title: 'assets' }))
    .pipe(gulp.dest('public', gulp.lastRun('assets')));
});

gulp.task('watch', function () {
  gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
});

gulp.task('build', gulp.series('clean', gulp.parallel(['styles', 'assets'])));

gulp.task('serve', function () {
  browserSync.init({
    server: 'public',
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
