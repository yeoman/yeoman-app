'use strict';

var app = require('app');
var debug = require('debug')('yoapp:main');

process.on('uncaughtException', function(error) {
  console.app(error.message);
  console.app(error.stack);
});

app.on('will-finish-launching', function () {
  setupCrashReporter();
});

function setupCrashReporter() {
  debug('setupCrashReporter()');
  // TODO: Register own crash reporter server
  // https://github.com/atom/atom-shell/blob/master/docs/api/crash-reporter.md
  require('crash-reporter').start();
}

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
  debug('Event: ready');
  var YoApplication = require('./browser/yo-application.js');
  YoApplication.ope2n();
});
