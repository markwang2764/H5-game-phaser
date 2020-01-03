const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');

const del = require('del');
const babel = require('gulp-babel');

var dir = "src/pages/game/";
var app = "pao/v4.1";

var time = (function () {
  var date = new Date();
  var Y = date.getFullYear();
  var M = date.getMonth() + 1;
  var D = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();

  function addZero(num) {
    return num > 9 ? num : '0' + num;
  }

  return [Y, addZero(M), addZero(D), addZero(h), addZero(m)].join("");
})();

// time = "201807230044";


gulp.task('clean', (cb) => {
  // console.log('gulp/dist/' + app)
  return del(['gulp/dist/'], cb);
});

// if (app === "pao/v2/") {
gulp.task('minifyjs', () =>
  gulp.src([dir + app + "/js/*.js", dir + app + "/newflash/*.js", , dir + app + "/newjs/*.js"])
    .pipe(concat('all.js'))
    .pipe(rename({suffix: '_' + time}))
    .pipe(babel({
      "presets": ["es2015", "stage-2"],
      /*"plugins": ["transform-runtime"]*/
    }))
    .pipe(uglify())
    .pipe(gulp.dest('gulp/dist/' + app))
)
// }

gulp.task('minifycss', () => {
  gulp.src(dir + app + '/css/all.less')
  .pipe(less())
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(rename({suffix:'_' + time}))
  .pipe(minifycss())
  .pipe(gulp.dest('gulp/dist/' + app))
})

gulp.task('build', ['clean'], () => {
  gulp.start('minifycss', 'minifyjs');
  console.log("当前操作项目：" + app);
  console.log("当前版本号：" + time);
});