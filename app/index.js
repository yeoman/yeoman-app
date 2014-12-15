'use strict';

var app = require('app');
var log = require('./browser/util/logger')('Bootstrap');
var argv = require('minimist');

// Print some  information about the system and the application.
log.info('Run %s in version %s', app.getName(), app.getVersion());
log.info('Platform: %s', process.platform);
log.info(process.versions, 'Versions:');

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

// Enable ES6 in the Renderer process
app.commandLine.appendSwitch('js-flags', '--harmony');

var args = parseArgs();

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function ready() {

  app.commandLine.appendSwitch('js-flags', '--harmony');

  var YoApplication = require('./browser/application');
  YoApplication.open(args);
});
