'use strict';

var app = require('app');
var log = require('./browser/util/logger');
var argv = require('minimist');

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

function parseArgs() {
  var args = argv(process.argv);
  var devMode = args.debug || null;
  var logLevel = args.loglevel || null;

  return {
    devMode: devMode,
    logLevel: logLevel
  };
}

var args = parseArgs();

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function ready() {
  log.trace('Start application');

  var YoApplication = require('./browser/yo-application');
  YoApplication.open(args);
});
