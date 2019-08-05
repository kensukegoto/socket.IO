const gulp = require("gulp");
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
// webpack
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config"); // webpackの設定ファイルの読み込み

const sass = require("gulp-dart-sass");
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');

function styles(){

  return gulp.src(['./_development/**/*.scss'])
  .pipe(plumber())
  .pipe(sass({outputStyle: 'expanded'}))
  .on('error', notify.onError(function(err) {
    return err.message;
  }))
  .pipe(postcss([autoprefixer()]))
  .pipe(postcss([mqpacker()]))
  .pipe(gulp.dest('./public/'))
}

function bundleJs(mode){

  return plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    })
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('./public/js/'));

}

gulp.task('default',gulp.parallel(
  function(){
    return gulp.watch('./_development/**/*.js',() => bundleJs())
  },
  function(){
    return gulp.watch('./_development/**/*.scss',() => styles())
  },
));