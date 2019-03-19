var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
 
function handleError (error) {
  console.log(error.toString())
  this.emit('end')
}

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
})
 
gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
      .pipe(sass())
      .on('error', handleError)
      .pipe(gulp.dest('src/css'))
      .pipe(browserSync.reload({
        stream: true
      }))
});
	
gulp.task('watch',['browserSync','sass'], function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload); 
})