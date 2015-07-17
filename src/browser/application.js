'use strict';

var app = require('app');
var ipc = require('ipc');
var path = require('path');
var shell = require('shell');
var BrowserWindow = require('browser-window');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore-plus');
var AppMenu = require('./appmenu');
var AppWindow = require('./appwindow');

/**
 * The application's class.
 *
 * It's the entry point into the application and maintains the global state of the application.
 *
 * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
 * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
 */
function Application () {
  var options = {};
  this.pkgJson = require('../../package.json');
  this.windows = [];

  this.handleEvents();
  this.openWithOptions(options);
}

_.extend(Application.prototype, EventEmitter.prototype);

/**
 * Opens a new window based on the options provided.
 *
 * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
 * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
 */
Application.prototype.openWithOptions = function (options) {
  var newWindow;
  var test = options.test;

  if (test) {
    newWindow = this.openSpecsWindow(options);
  } else {
    newWindow = this.openWindow(options);
  }

  newWindow.show();
  this.windows.push(newWindow);
  newWindow.on('closed', function () {
    this.removeAppWindow(newWindow);
  }.bind(this));
};

/**
 * Opens up a new AtomWindow to run specs within.
 *
 * @param {boolean} [options.exitWhenDone] Boolean to determine whether to automatically exit.
 */
Application.prototype.openSpecsWindow = function (options) {
  var bootstrapScript;
  var exitWhenDone = options.exitWhenDone;

  try {
    bootstrapScript = require.resolve(path.resolve(__dirname, 'spec', 'renderer-process', 'helpers', 'bootstrap'));
  } catch (error) {
    bootstrapScript = require.resolve(path.resolve(__dirname, '..', '..', 'spec', 'renderer-process', 'helpers', 'bootstrap'));
  }

  var isSpec = true;
  return new AppWindow({
    bootstrapScript: bootstrapScript,
    exitWhenDone: exitWhenDone,
    isSpec: isSpec,
    title: this.pkgJson.productName + '\'s Spec Suite'
  });
};

/**
 * Opens up a new AppWindow and runs the application.
 */
Application.prototype.openWindow = function () {
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
  this.menu.on('application:quit', function () {
    app.quit();
  });

  this.menu.on('application:report-issue', function () {
    shell.openExternal(this.pkgJson.bugs);
  }.bind(this));

  this.menu.on('window:reload', function () {
    BrowserWindow.getFocusedWindow().reload();
  });

  this.menu.on('window:toggle-full-screen', function () {
    var focusedWindow = BrowserWindow.getFocusedWindow();
    var fullScreen = true;
    if (focusedWindow.isFullScreen()) {
      fullScreen = false;
    }

    focusedWindow.setFullScreen(fullScreen);
  });

  this.menu.on('window:toggle-dev-tools', function () {
    BrowserWindow.getFocusedWindow().toggleDevTools();
  });

  this.menu.on('application:run-specs', function () {
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
Application.prototype.removeAppWindow = function (appWindow) {
  this.windows.forEach(function (win, index) {
    if (win === appWindow) {
      this.windows.splice(index, 1);
    }
  }.bind(this));
};

Application.prototype.handleEvents = function () {

  this.on('application:quit', function () {
    return app.quit();
  });

  ipc.on('context-appwindow', function (event) {
    var args = Array.prototype.slice.call(arguments, 1);
    var appWindow = this.windowForEvent(event.sender);
    appWindow.emit.apply(appWindow, args);
  }.bind(this));

  ipc.on('context-generator', function (event) {
    var args = Array.prototype.slice.call(arguments, 1);
    var appWindow = this.windowForEvent(event.sender);
    appWindow.sendCommandToProcess.apply(appWindow, args);
  }.bind(this));
};

// Returns the {AppWindow} for the given ipc event.
Application.prototype.windowForEvent = function (sender) {
  var win = BrowserWindow.fromWebContents(sender);
  return _.find(this.windows, function (appWindow) {
    return appWindow.window === win;
  });
};

module.exports = Application;
