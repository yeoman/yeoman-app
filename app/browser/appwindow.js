'use strict';

var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var BrowserWindow = require('browser-window');
var Connector = require('./connector');
var logger = require('./util/logger');

var AppWindow;

var resourcePath = 'file://' + path.join(__dirname, '..', 'index.html');
var windowWidth = 1024;
var windowHeight = 700;

module.exports = AppWindow= function(options) {

  // List of all available options -> https://github.com/atom/atom-shell/blob/master/docs/api/browser-window.md#new-browserwindowoptions
  var windowOptions = {
    width: windowWidth,
    height: windowHeight,
    show: false // Hide window while app is initializing
  };

  this.browserWindow = new BrowserWindow(windowOptions);

  this.log = logger(this.getId());
  this.log.trace('Initialize %s', this.getId());

  this.browserWindow.loadUrl(resourcePath);

  // Wait for the onload event from the web view
  this.browserWindow.webContents.on('did-finish-load', function () {

    this.setupConnector();

    // The app is ready to use, light on.
    this.browserWindow.show();
  }.bind(this));

  global.application.addWindow(this);
};

_.extend(AppWindow.prototype, EventEmitter.prototype);

AppWindow.prototype.sendCommandToBrowserWindow = function() {
  this.browserWindow.webContents.send.apply(this.browserWindow.webContents, arguments);
};

AppWindow.prototype.setupConnector = function() {
  this.connector = new Connector(this);
};

AppWindow.prototype.getId = function() {
  return util.format('AppWindow_%s', this.browserWindow.webContents.getId());
};

