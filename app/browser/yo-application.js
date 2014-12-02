'use strict';

var debug = require('debug')('yoapp:application');
var path = require('path');
var BrowserWindow = require('browser-window');
var app = require('app');
var Connector = require('./yo-connector');

var YoApplication;

var resourcePath = 'file://' + path.join(__dirname, '..', 'index.html');
var windowWidth = 860;
var windowHeight = 600;

module.exports = YoApplication= function(){

  // TODO:
  // - Add auto updater -> https://github.com/atom/atom-shell/blob/master/docs/api/auto-updater.md
  // - Add insight -> https://github.com/yeoman/insight
  // - Add application menu -> https://github.com/atom/atom-shell/blob/master/docs/api/menu.md

  // List of all available options -> https://github.com/atom/atom-shell/blob/master/docs/api/browser-window.md#new-browserwindowoptions
  var windowOptions = {
    width: windowWidth,
    height: windowHeight,
    show: false // Hide window while app is initializing
  };

  this.mainWindow = new BrowserWindow(windowOptions);
  this.mainWindow.loadUrl(resourcePath);

  // Wait for the onload event from the web view
  this.mainWindow.webContents.on('did-finish-load', function () {
    debug('Event: did-finish-load');

    this.setupConnector();
    this.handleEvents();

    // The app is ready to use, light on.
    this.mainWindow.show();
  }.bind(this));
};

// Create a new application instance
YoApplication.open = function() {
  return new YoApplication();
};

YoApplication.prototype.handleEvents = function() {

  this.mainWindow.on('close', function (event) {
    // TODO: Confirm closing if generator is running
  });

  app.on('will-quit', function (event) {
    // TODO: Kill processes e.g npm / bower install
  });

  this.mainWindow.on('closed', function () {
    this.mainWindow= null;
  });
};

YoApplication.prototype.setupConnector = function() {
  this.connector = new Connector(this.mainWindow);
};
