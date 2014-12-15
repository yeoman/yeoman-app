'use strict';

var app = require('app');
var AppWindow = require('./appwindow');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var BrowserWindow = require('browser-window');
var log = require('./util/logger')('Application');
var ipc = require('ipc');

var Application;

module.exports = Application= function(options) {
  this.devMode = options.devMode;
  this.logLevel = options.logLevel;

  global.application = this;

  this.windows = [];

  // TODO:
  // - Add auto updater -> https://github.com/atom/atom-shell/blob/master/docs/api/auto-updater.md
  // - Add insight -> https://github.com/yeoman/insight
  // - Add application menu -> https://github.com/atom/atom-shell/blob/master/docs/api/menu.md

  this.handleEvents();
  this.addDockMenu();
  this.openWindow();
};

_.extend(Application.prototype, EventEmitter.prototype);

// The applications entrty point
Application.open = function(options) {
  return new Application(options);
};

Application.prototype.handleEvents = function() {

  this.on('application:quit', function() {
    return app.quit();
  });

  this.on('application:new-window', function() {
    this.openWindow();
  }.bind(this));

  ipc.on('context-appwindow', function(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    var appWindow = this.windowForEvent(event.sender);
    log.trace('Emit %s on %s with args', args[0],  appWindow.getId(), args.slice(1));
    appWindow.emit.apply(appWindow, args);
  }.bind(this));

  app.on('window-all-closed', function() {
    var platform =  process.platform;
    if (platform  === 'win32' || platform === 'linux') {
      return app.quit();
    }
  });
};

Application.prototype.removeWindow = function(window) {
  log.trace('Remove %s', window.getId());
  this.windows.splice(this.windows.indexOf(window), 1);
};

Application.prototype.addWindow = function(window) {
  log.trace('Add %s', window.getId());
  this.windows.push(window);
};

Application.prototype.openWindow = function() {
  var openedWindow = new AppWindow();
};

Application.prototype.focusedWindow = function() {
  return _.find(this.windows, function(appWindow) {
    return appWindow.isFocused();
  });
};

// Returns the {AppWindow} for the given ipc event.
Application.prototype.windowForEvent = function(sender) {
  var win = BrowserWindow.fromWebContents(sender);
  return _.find(this.windows, function(appWindow) {
    return appWindow.browserWindow === win;
  });
};

Application.prototype.addDockMenu = function() {
  var Menu = require('menu');
  var dockMenu = Menu.buildFromTemplate([
    { label: 'New Window', click: function() {
      this.emit('application:new-window');
    }.bind(this) },
  ]);
  app.dock.setMenu(dockMenu);
};
