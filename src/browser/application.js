'use strict';

var Menu = require('menu');
var BrowserWindow = require('browser-window');
var app = require('app');
var fs = require('fs-plus');
var ipc = require('ipc');
var path = require('path');
var os = require('os');
var net = require('net');
var url = require('url');
var shell = require('shell');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore-plus');
var AppMenu = require('./appmenu');
var AppWindow = require('./appwindow');

/**
 * The application's class.
 *
 * It's the entry point into the application and maintains the global state of the application.
 *
 * @param {string}  [options.resourcePath]  The path to include specs from.
 * @param {boolean} [options.devMode]       Boolean to determine if the application is running in dev mode.
 * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
 * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
 * @param {string}  [options.logfile]       The file path to log output to.
 */
function Application() {
  var options = {};
  this.resourcePath = options.resourcePath;
  this.devMode = options.devMode;
  this.pkgJson = require('../../package.json');
  this.windows = [];

  this.handleEvents();
  this.openWithOptions(options);
}

_.extend(Application.prototype, EventEmitter.prototype);

/**
 * Opens a new window based on the options provided.
 *
 * @param {string}  [options.resourcePath]  The path to include specs from.
 * @param {boolean} [options.devMode]       Boolean to determine if the application is running in dev mode.
 * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
 * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
 * @param {string}  [options.logfile]       The file path to log output to.
 */
Application.prototype.openWithOptions = function(options) {
  var newWindow;
  var test = options.test;

  if (test) {
    newWindow = this.openSpecsWindow(options);
  } else {
    newWindow = this.openWindow(options);
  }

  newWindow.show();
  this.windows.push(newWindow);
  newWindow.on('closed', function() {
    this.removeAppWindow(newWindow);
  }.bind(this));
};

/**
 * Opens up a new AtomWindow to run specs within.
 *
 * @param {boolean} [options.exitWhenDone] Boolean to determine whether to automatically exit.
 * @param {string}  [options.resourcePath] The path to include specs from.
 * @param {string} [options.logfile]       The file path to log output to.
 */
Application.prototype.openSpecsWindow = function(options) {
  var bootstrapScript;
  var exitWhenDone = options.exitWhenDone;
  var resourcePath = options.resourcePath;
  var logFile = options.logFile;

  if (resourcePath !== this.resourcePath && !fs.existsSync(resourcePath)) {
    resourcePath = this.resourcePath;
  }

  try {
    bootstrapScript = require.resolve(path.resolve(__dirname, 'spec', 'spec-bootstrap'));
  } catch (error) {
    bootstrapScript = require.resolve(path.resolve(__dirname, '..', '..', 'spec', 'spec-bootstrap'));
  }

  var isSpec = true;
  var devMode = true;
  return new AppWindow({
    bootstrapScript: bootstrapScript,
    exitWhenDone: exitWhenDone,
    resourcePath: resourcePath,
    isSpec: isSpec,
    devMode: devMode,
    logFile: logFile,
    title: this.pkgJson.productName + '\'s Spec Suite'
  });
};

/**
 * Opens up a new AppWindow and runs the application.
 *
 * @param {string}  [options.resourcePath] The path to include specs from.
 * @param {boolean} [options.devMode]      Boolean to determine if the application is running in dev mode.
 * @param {boolean} [options.test]         Boolean to determine if the application is running in test mode.
 * @param {boolean} [options.exitWhenDone] Boolean to determine whether to automatically exit.
 * @param {string} [options.logfile]       The file path to log output to.
 */
Application.prototype.openWindow = function(options) {
  var appWindow;
  appWindow = new AppWindow({
    title: this.pkgJson.productName,
    width: 1024,
    height: 700
  });
  this.menu = new AppMenu({
    pkg: this.pkgJson
  });
  this.menu.attachToWindow(appWindow);
  this.menu.on('application:quit', function() {
    app.quit();
  });

  this.menu.on('application:report-issue', function() {
    shell.openExternal(this.pkgJson.bugs);
  }.bind(this));

  this.menu.on('window:reload', function() {
    BrowserWindow.getFocusedWindow().reload();
  });

  this.menu.on('window:toggle-full-screen', function() {
    var focusedWindow = BrowserWindow.getFocusedWindow();
    var fullScreen = true;
    if (focusedWindow.isFullScreen()) {
      fullScreen = false;
    }

    focusedWindow.setFullScreen(fullScreen);
  });

  this.menu.on('window:toggle-dev-tools', function() {
    BrowserWindow.getFocusedWindow().toggleDevTools();
  });

  this.menu.on('application:run-specs', function() {
    return this.openWithOptions({
      test: true
    });
  }.bind(this));
  return appWindow;
};

/**
 * Removes the given window from the list of windows, so it can be GC'd.
 *
 * @param {AppWindow} appWindow The AppWindow to be removed
 */
Application.prototype.removeAppWindow = function(appWindow) {
  this.windows.forEach(function(win, index) {
    if (win === appWindow) {
      this.windows.splice(index, 1);
    }
  }.bind(this));
};

Application.prototype.handleEvents = function() {

  this.on('application:quit', function() {
    return app.quit();
  });

  ipc.on('context-appwindow', function(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    var appWindow = this.windowForEvent(event.sender);
    appWindow.emit.apply(appWindow, args);
  }.bind(this));

  ipc.on('context-generator', function(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    var appWindow = this.windowForEvent(event.sender);
    appWindow.sendToChild.apply(appWindow, args);
  }.bind(this));
};

// Returns the {AppWindow} for the given ipc event.
Application.prototype.windowForEvent = function(sender) {
  var win = BrowserWindow.fromWebContents(sender);
  return _.find(this.windows, function(appWindow) {
    return appWindow.window === win;
  });
};

module.exports = Application;
