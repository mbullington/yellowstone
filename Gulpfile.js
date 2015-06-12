const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const manifest = require('./package.json');
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);

gulp.task('build', function() {
  // Create our output directory
  mkdirp.sync(destinationFolder);
  return gulp.src('lib/*.js')
    .pipe($.plumber())
    .pipe($.babel({ blacklist: ['useStrict'] }))
    .pipe(gulp.dest(destinationFolder));
});

// Make babel preprocess the scripts the user tries to import from here on.
require('babel/register');
