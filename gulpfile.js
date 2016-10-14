var path = require('path');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat')
var runSequence = require('run-sequence').use(gulp);

gulp.task('clean', function(){
  return del('dist');
});

gulp.task('build:server', function(){
  var tsProject = ts.createProject(path.resolve('./server/tsconfig.json'));
  return gulp.src(path.resolve('./server/**/*.ts'))
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .js
    //.pipe(concat('server.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.resolve('./dist/server')));
});

gulp.task('build:app', function(){
    var tsProject = ts.createProject(path.resolve('./public/tsconfig.json'), { outFile:"main.js"});
    return gulp.src(path.resolve('./public/**/*.ts'))
		.pipe(sourcemaps.init())
    .pipe(ts(tsProject))
	  .js
    .pipe(sourcemaps.write())
		.pipe(gulp.dest(path.resolve('./dist/app')));
});

gulp.task('watch', function() {
    gulp.watch(['./public/**/*.ts'], ['build:app']);
    gulp.watch(['./server/**/*.ts'], ['build:server']);
});


gulp.task('build', function(callback){
    runSequence('clean', 'build:server', 'build:app', callback);
});

gulp.task('default', ['build', 'watch']);
