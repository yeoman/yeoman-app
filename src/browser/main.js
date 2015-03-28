'use strict';

var app = require('app');
var url = require('url');
var path = require('path');
var fs = require('fs-plus');
var spawn = require('child_process').spawn;

var BrowserWindow = require('browser-window');
var Application = require('./application');

// NB: Hack around broken native modules atm
var nslog = console.log;

global.shellStartTime = Date.now();

process.on('uncaughtException', function(error) {
  if (error == null) {
    error = {};
  }

  if (error.message != null) {
    nslog(error.message);
  }

  if (error.stack != null) {
    nslog(error.stack);
  }
});

function parseCommandLine() {
  var version = app.getVersion();

  var yargs = require('yargs')
    .alias('d', 'dev').boolean('d').describe('d', 'Run in development mode.')
    .alias('h', 'help').boolean('h').describe('h', 'Print this usage message.')
    .alias('l', 'log-file').string('l').describe('l', 'Log all output to file.')
    .alias('r', 'resource-path').string('r').describe('r', 'Set the path to the App source directory and enable dev-mode.')
    .alias('t', 'test').boolean('t').describe('t', 'Run the specified specs and exit with error code on failures.')
    .alias('v', 'version').boolean('v').describe('v', 'Print the version.');

  var resourcePath;
  var args = yargs.parse(process.argv.slice(1));
  var devMode = args.dev;
  var test = args.test;
  var exitWhenDone = test;
  var logFile = args['log-file'];

  process.stdout.write(JSON.stringify(args) + '\n');
  if (args.help) {
    var help = '';
    yargs.showHelp(function(s) {
      return help += s;
    });

    process.stdout.write(help + '\n');
    process.exit(0);
  }

  if (args.version) {
    process.stdout.write(version + '\n');
    process.exit(0);
  }

  if (args['resource-path']) {
    devMode = true;
    resourcePath = args['resource-path'];

    if (resourcePath == null) {
      resourcePath = global.devResourcePath;
    }
  }

  if (!fs.statSyncNoException(resourcePath)) {
    resourcePath = path.join(process.resourcesPath, 'app.asar');
  }

  resourcePath = path.resolve(resourcePath);
  return {
    resourcePath: resourcePath,
    devMode: devMode,
    test: test,
    exitWhenDone: exitWhenDone,
    logFile: logFile
  };
}

function start() {
  var args;

  // Enable ES6 in the Renderer process
  app.commandLine.appendSwitch('js-flags', '--harmony');
  args = parseCommandLine();
  if (args.devMode) {
    app.commandLine.appendSwitch('remote-debugging-port', '8315');
  }

  // Note: It's important that you don't do anything with Atom Shell
  // unless it's after 'ready', or else mysterious bad things will happen
  // to you.
  app.on('ready', function() {
    require('../babel').register();
    if (args.devMode) {
      Application = require(path.join(args.resourcePath, 'src', 'browser', 'application'));
    } else {
      Application = require('./application');
    }

    global.application = new Application(args);
    if (!args.test) {
      console.log('App load time: ' + (Date.now() - global.shellStartTime) + 'ms');
    }
  });
}

start();
