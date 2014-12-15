'use strict';

var path = require('path');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var BrowserWindow = require('browser-window');
var Connector = require('./connector');

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
  this.browserWindow.loadUrl(resourcePath);

  // Wait for the onload event from the web view
  this.browserWindow.webContents.on('did-finish-load', function () {

    this.handleEvents();
    this.setupConnector();

    // The app is ready to use, light on.
    this.browserWindow.show();
  }.bind(this));

  global.application.addWindow(this);
};

_.extend(AppWindow.prototype, EventEmitter.prototype);

AppWindow.prototype.handleEvents = function() {

  this.on('connector:generator-data', function(data) {
    this.browserWindow.webContents.send('generators-data', data);
  });

  this.on('connector:generator-error', function(err) {
    this.browserWindow.webContents.send('generator-error', err);
  });

  this.on('connector:generator-done', function(data) {
    this.browserWindow.webContents.send('generator-done', data);
  });

  this.on('connector:directory-selected', function(data) {
    this.browserWindow.webContents.send('helpers.dialogs.selectDir', data);
  });

  this.on('connector:generator-prompt', function(data) {
    this.browserWindow.webContents.send('question-prompt', data);
  });
};

AppWindow.prototype.setupConnector = function() {
  this.connector = new Connector(this);
};

