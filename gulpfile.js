/* eslint-disable */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

const server = browserSync.create();

var paths = {
  styles: {
    src: './scss/**/*.scss',
    dest: './css'
  },
  scripts: {
    src: './js/**/*.js',
  },
  html: {
    input: './index.html',
  },
};

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false,
      }),
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
}

/*
 * task to minify the css files
 * SCSS files are converted to CSS and than minified by the following task
 */

function minifyCSS() {
  return gulp
    .src('css/*.css')
    .pipe(
      cleanCSS({ debug: true }, function(details) {
        console.log('=========================================');
        console.log(details.name + ': ' + details.stats.originalSize);
        console.log(details.name + ': ' + details.stats.minifiedSize);
        console.log('=========================================');
      }),
    )
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(gulp.dest('css/min'));
}

// Optimizing Images
function optimiseImages() {
  return (
    gulp
      .src('./img/**/*.+(png|jpg|jpeg|gif|svg)')
      // Caching images that ran through imagemin
      .pipe(
        imagemin({
          interlaced: true,
        }),
      )
      .pipe(gulp.dest('./img'))
  );
}

function reload(done) {
  server.reload();
  done();
}

// hack
function staticReload() {
  server.reload()
}

function serve(done) {
  server.init({
    server: {
      baseDir: './',
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });
  done();
}

function watch() {
  gulp.watch(paths.html.input).on('change', staticReload);
  gulp.watch(paths.styles.src, gulp.series(styles, reload));
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(gulp.parallel(styles));

var dev = gulp.series(gulp.parallel(styles), serve, watch);

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */

exports.styles = styles;
exports.watch = watch;
exports.build = build;
exports.dev = dev;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
