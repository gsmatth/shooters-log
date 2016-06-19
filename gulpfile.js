'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('nodemon');
const mocha = require('gulp-mocha');

const paths = ['*.js', 'lib/*.js', 'model/*.js', 'route/*.js', 'test/*.js', 'controller/**/*.js'];


gulp.task('eslint', function(){
  gulp.src(paths)
  .pipe(eslint())
  .pipe(eslint.format());
  // .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
  return gulp.src('./test/*-test.js', {read: false})
  .pipe(mocha({reporter: 'list'}));
});

gulp.task('nodemon', function(){
  nodemon({
    script: 'server.js',
    ext: 'js'
  });
});

gulp.task('default', ['eslint', 'test']);
