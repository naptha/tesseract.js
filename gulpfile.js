const gulp = require('gulp');
const babel = require('gulp-babel');

const srcFiles = ['src/*.js', 'src/**/*.js'];

gulp.task('transpile', () => (
  gulp.src(srcFiles)
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('lib'))
));

gulp.task('transpile:watch', () => (
  gulp.watch(srcFiles, ['transpile'])
));
