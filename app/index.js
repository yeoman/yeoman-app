'use strict';

var app = require('app');
var YoApplication = require('./browser/yo-application');
var log = require('./browser/util/logger');


// Catch unhandled exceptions
process.on('uncaughtException', function uncaughtException(error) {
  log.error(error);
});

app.on('will-finish-launching', function willFinishLaunching() {
  setupCrashReporter();
});

function setupCrashReporter() {
  // TODO: Register own crash reporter server
  // https://github.com/atom/atom-shell/blob/master/docs/api/crash-reporter.md
  require('crash-reporter').start();
}

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function ready() {
  log.trace('Start application');

  YoApplication.open();
});
