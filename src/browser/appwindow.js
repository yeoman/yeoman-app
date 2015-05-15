'use strict';

var dialog = require('dialog');
var path = require('path');
var url = require('url');
var EventEmitter = require('events').EventEmitter;
var BrowserWindow = require('browser-window');
var fork = require('child_process').fork;
var _ = require('underscore-plus');
var killChildProcess = require('./util/kill-childprocess');

function AppWindow(options) {
  this.loadSettings = {
    bootstrapScript: require.resolve('../renderer/main')
  };
  this.loadSettings = _.extend(this.loadSettings, options);

  var windowOpts = {
    'web-preferences': {
      'subpixel-font-scaling': true,
      'direct-write': true
    }
  };
  windowOpts = _.extend(windowOpts, this.loadSettings);

  this.window = new BrowserWindow(windowOpts);
  this.window.on('closed', function(e) {
    this.emit('closed', e);
  }.bind(this));

  this.window.on('devtools-opened', function() {
    this.window.webContents.send('window:toggle-dev-tools', true);
  }.bind(this));

  this.window.on('devtools-closed', function() {
    this.window.webContents.send('window:toggle-dev-tools', false);
  }.bind(this));
}

_.extend(AppWindow.prototype, EventEmitter.prototype);

AppWindow.prototype.show = function() {
  var targetPath = path.resolve(__dirname, '..', '..', 'static', 'index.html');
  var targetUrl = url.format({
    protocol: 'file',
    pathname: targetPath,
    slashes: true,
    query: {
      loadSettings: JSON.stringify(this.loadSettings)
    }
  });
  this.window.loadUrl(targetUrl);

  this.window.webContents.on('did-finish-load', function() {
    this.initYoProcess();
  }.bind(this));

  this.window.show();
};

AppWindow.prototype.reload = function() {
  this.window.webContents.reload();
};

AppWindow.prototype.toggleFullScreen = function() {
  this.window.setFullScreen(!this.window.isFullScreen());
};

AppWindow.prototype.toggleDevTools = function() {
  this.window.toggleDevTools();
};

AppWindow.prototype.close = function() {
  this.window.close();
  this.window = null;
};

AppWindow.prototype.sendCommandToBrowserWindow = function() {
  this.window.webContents.send.apply(this.window.webContents, arguments);
};

AppWindow.prototype.initYoProcess = function () {
  this.yoProcess = fork(path.join(__dirname, 'yo', 'yo.js'));

  this.yoProcess.on('message', function (msg) {
    console.log('APP', msg);

    this.sendCommandToBrowserWindow(msg.event, msg.data);

  }.bind(this));

  this.sendToChild('generator:init');
};

AppWindow.prototype.killYoProcess = function () {
  if (this.yoProcess && this.yoProcess.pid) {
    killChildProcess(this.yoProcess.pid, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
};

AppWindow.prototype.sendToChild = function (name) {
  var args = Array.prototype.slice.call(arguments, 1);

  if (name === 'generator:cancel') {
    this.killYoProcess();
    return;
  }

  if ( name === 'generator:open-dialog') {
    var opts = {
      title: 'Select a folder to generate the project into',
      properties: ['openDirectory', 'createDirectory']
    };

    dialog.showOpenDialog(this.window, opts, function(filenames) {
      if (!filenames) return;
      this.sendCommandToBrowserWindow('generator:directory-selected', filenames.shift());
    }.bind(this));

    return;
  }

  this.yoProcess.send({
    action: name,
    args: args
  });
};

module.exports = AppWindow;
