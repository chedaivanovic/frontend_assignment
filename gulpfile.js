'use strict';

const { src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
//Compile, prefix and minify scss
function compilescss() {
  return src('prod/scss/*.scss') 
    .pipe(sass())
    .pipe(prefix('last 2 versions'))
    .pipe(minify())
    .pipe(dest('assets/css'));
};

//Minify js
function jsmin(){
  return src('prod/js/*.js') 
    .pipe(terser())
    .pipe(dest('assets/js')); 
}


//Live Preview
function browserSyncServe(cb){
 browserSync.init({
    server:{
      baseDir: './'
    }
  });
  cb();
}

//On Change update
function browserSyncReload(cb){
  browserSync.reload();
  cb;
}

//Watchtask
function watchTask(){
  watch('*.html').on('change', browserSyncReload);
  watch('prod/js/*.js', jsmin).on('change', browserSyncReload);
  watch('prod/scss/*.scss', compilescss).on('change', browserSyncReload);
}

//Default Gulp task 
exports.default = series(
  compilescss,
  jsmin,
  browserSyncServe,
  watchTask
);