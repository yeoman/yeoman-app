var gulp = require('gulp'),
  glob = require('glob'),
  path = require('path'),
  Stream = require('stream'),
  less = require('gulp-less'),
  plumber = require('gulp-plumber'),
  LessPluginAutoPrefix = require('less-plugin-autoprefix'),
  autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] }),
  electron = require('electron-connect').server.create()
  ;

gulp.task('default', ['less', 'watch', 'electron']);
gulp.task('build', ['lessci'])

// Compile less
gulp.task('less', function () {
  compileLess('./static/less/main.less');
});
gulp.task('lessci', function () {
  compileLessCI('./static/less/main.less');
});

function compileLess(file){
  return _compileLess(file, false);
}

function compileLessCI(file){
  return _compileLess(file, true);
}

function _compileLess(file, forCI) {
  console.log("Compiling " + file)
  var dist = path.join(__dirname, 'static', 'less');

  var stream = gulp.src(file);
  if (!forCI) {
    stream = stream.pipe(plumber());
  };
  stream
    .pipe(less({
      paths: [ path.join(__dirname, 'static', 'less') ],
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest(dist))
    .pipe(reload())
    ;
}

function reload(obj) {
  var stream = new Stream.Transform({objectMode: true});
  stream._transform = function(file, unused, callback) {
    electron.reload();
    callback(null, file);
  }
  return stream;
}

function restart(obj) {
  var stream = new Stream.Transform({objectMode: true});
  stream._transform = function(file, unused, callback) {
    electron.restart();
    callback(null, file);
  }
  return stream;
}

// Watch
gulp.task('watch', function () {
  glob.sync('./static/less/**/*.less').forEach(watchLess);
  glob.sync('./static/**/*.html').forEach(watchHtml);
  glob.sync('./src/browser/**/*.js').forEach(watchBrowser);
  glob.sync('./src/renderer/**/*.js').forEach(watchRenderer);
});
function watchLess(file) {
  gulp.watch(file, ['less']);
}
function watchHtml(file) {
  gulp.watch(file, electron.reload);
}
function watchBrowser(file) {
  gulp.watch(file, electron.restart);
}
function watchRenderer(file) {
  gulp.watch(file, electron.reload);
}

// Start electron
gulp.task('electron', function () {
  // Start browser process
  electron.start();
});
