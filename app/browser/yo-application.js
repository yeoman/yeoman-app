'use strict';

var app = require('app');
var YoWindow = require('./yo-window');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var YoApplication;

module.exports = YoApplication= function(options) {
  this.devMode = options.devMode;
  this.logLevel = options.logLevel;

  global.yoApplication = this;
  this.pidsToOpenWindows = {};
  this.windows = [];

  // TODO:
  // - Add auto updater -> https://github.com/atom/atom-shell/blob/master/docs/api/auto-updater.md
  // - Add insight -> https://github.com/yeoman/insight
  // - Add application menu -> https://github.com/atom/atom-shell/blob/master/docs/api/menu.md

  this.handleEvents();
  this.addDockMenu();
  this.openWindow();
};

_.extend(YoApplication.prototype, EventEmitter.prototype);

// The applications entrty point
YoApplication.open = function(options) {
  return new YoApplication(options);
};

YoApplication.prototype.handleEvents = function() {

  this.on('application:quit', function() {
    return app.quit();
  });

  this.on('application:new-window', function() {
    this.openWindow();
  }.bind(this));

  app.on('window-all-closed', function() {
    var _ref =  process.platform;
    if (_ref  === 'win32' || _ref === 'linux') {
      return app.quit();
    }
  });
};

YoApplication.prototype.removeWindow = function(window) {
  this.windows.splice(this.windows.indexOf(window), 1);
};

YoApplication.prototype.addWindow = function(window) {
  this.windows.push(window);
};

YoApplication.prototype.openWindow = function() {
  var openedWindow = new YoWindow();
};

YoApplication.prototype.focusedWindow = function() {
  return _.find(this.windows, function(yoWindow) {
    return yoWindow.isFocused();
  });
};

YoApplication.prototype.addDockMenu = function() {
  var Menu = require('menu');
  var dockMenu = Menu.buildFromTemplate([
    { label: 'New Window', click: function() {
      this.emit('application:new-window');
    }.bind(this) },
  ]);
  app.dock.setMenu(dockMenu);
};
