'use strict';

var BrowserWindow = require('browser-window');
var app = require('app');
var yo = require('./lib/yo-connector');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

var YoApplication;
module.exports = YoApplication= function(){

};

YoApplication.prototype.open = function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 860, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Starts yo connection logic
  yo.start(mainWindow, mainWindow.webContents);
};

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Emitted when the window is closed.
mainWindow.on('closed', function () {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  mainWindow = null;
});


