'use strict';

var path = require('path');
var BrowserWindow = require('browser-window');
var Connector = require('./connector');

var YoWindow;

var resourcePath = 'file://' + path.join(__dirname, '..', 'index.html');
var windowWidth = 860;
var windowHeight = 600;

module.exports = YoWindow= function(options) {

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

    this.setupConnector();

    // The app is ready to use, light on.
    this.browserWindow.show();
  }.bind(this));

  global.application.addWindow(this);
};

YoWindow.prototype.setupConnector = function() {
  this.connector = new Connector(this.browserWindow);
};

