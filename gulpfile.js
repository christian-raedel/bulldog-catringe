var gulp          = require('gulp');
var gutil         = require('gulp-util');
var bower         = require('bower');
var concat        = require('gulp-concat');
var sass          = require('gulp-sass');
var minifyCss     = require('gulp-minify-css');
var rename        = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var sh            = require('shelljs');

var paths = {
    sass: ['./scss/**/*.scss'],
    tpl: ['./templates/**/*.tpl.html'],
    js: [
        /*
        './components/angular/angular.js',
        './components/angular-animate/angular-animate.js',
        './components/angular-sanitize/angular-sanitize.js',
        */
        './components/angular-ui-router/release/angular-ui-router.js',
        './app/**/*.js',
        '!./app/**/*.spec.js'
    ]
};

gulp.task('default', ['sass', 'templates', 'javascripts']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('templates', function (done) {
    gulp.src(paths.tpl)
    .pipe(templateCache())
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

gulp.task('javascripts', function (done) {
    gulp.src(paths.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.tpl, ['templates']);
  gulp.watch(paths.js.splice(-2), ['javascripts']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
