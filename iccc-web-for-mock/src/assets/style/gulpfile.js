'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const scssMerge = require('./merge');
const copyFn = require('./copy');
const config = require('../../../config/dev.env');
const { series, watch } = gulp;

const PACKAGE_PATH = '../../../node_modules/'; // node包路径
const STATIC_PATH = '../../../static/iccc/themes/style/'; // 主题文件路径
const FONT_PATH = '../../../node_modules/ui-component-v4/lib/theme-chalk/fonts/**'; // 图标库路径
const IMAGES_PATH = '../../../node_modules/ui-component-v4/lib/theme-chalk/images/**'; // 图标库路径
const ICON_PATH = '../../../node_modules/ui-component-v4/packages/theme-chalk/src/icon/**'; // 图标库路径

function copyProjectResources(cb) {
  let installedProject = config['INSTALLED_PROJECT'];
  console.log(installedProject);
  gulp.src('').pipe(copyFn(installedProject));
  // body omitted
  cb();
}

function mergeScss(cb) {
  gulp
    .src('./variable-theme-default.scss')
    .pipe(scssMerge('./modules/bundle.scss', '../' + PACKAGE_PATH))
    // .pipe(cssmin())
    .pipe(gulp.dest('./lib'));
  // body omitted
  cb();
}

function compile(cb) {
  gulp
    .src('./variable-theme-*.scss')
    .pipe(
      replace(/~.*?fonts/g, function() {
        // 替换~ 为包的相对路径
        return 'fonts';
      })
    )
    .pipe(
      replace(/~.*?images/g, function() {
        // 替换~ 为包的相对路径
        return 'images';
      })
    )
    .pipe(
      replace(/'~/g, function() {
        // 替换~ 为包的相对路径
        return "'" + PACKAGE_PATH;
      })
    )
    .pipe(
      replace(/"~/g, function() {
        // 替换~ 为包的相对路径
        return '"' + PACKAGE_PATH;
      })
    )
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ['ie > 9', 'last 2 versions'],
        cascade: false
      })
    )
    .pipe(cssmin())
    .pipe(
      rename(function(dir, base) {
        // 重命名输出文件，如theme-blue.css
        return base.replace('variable-', '') + '.css';
      })
    )
    .pipe(gulp.dest(STATIC_PATH));
  // body omitted
  cb();
}

function copyfont(cb) {
  gulp
    .src(FONT_PATH)
    .pipe(cssmin())
    .pipe(gulp.dest(STATIC_PATH + '/fonts'));
  // body omitted
  cb();
}
function copyicon(cb) {
  gulp
    .src(ICON_PATH)
    .pipe(cssmin())
    .pipe(gulp.dest(STATIC_PATH + '/icon'));
  // body omitted
  cb();
}
function copyuiimages(cb) {
  gulp
    .src(IMAGES_PATH)
    .pipe(cssmin())
    .pipe(gulp.dest(STATIC_PATH + '/images'));
  // body omitted
  cb();
}
function copyimages(cb) {
  gulp
    .src('images/**')
    .pipe(cssmin())
    .pipe(gulp.dest(STATIC_PATH + '../images'));
  // body omitted
  cb();
}
function watching(cb) {
  compile(cb);
  watch('./*.scss', compile);
}

exports.default = series(compile, copyfont, copyicon, copyimages, copyuiimages);
exports.merge = mergeScss;
exports.watching = watching;
exports.copyResources = this.copyProjectResources;
