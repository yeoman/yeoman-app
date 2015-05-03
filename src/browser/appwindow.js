'use strict';

var Menu = require('menu');
var app = require('app');
var fs = require('fs');
var ipc = require('ipc');
var dialog = require('dialog');
var path = require('path');
var os = require('os');
var net = require('net');
var url = require('url');
var EventEmitter = require('events').EventEmitter;
var BrowserWindow = require('browser-window');
var _ = require('underscore-plus');
var fork = require('child_process').fork;
<<<<<<< HEAD
var kill = require('./kill');
=======
var dialogs = require('./helpers/dialogs');
>>>>>>> 3c7dde0... Run yeoman in a child process

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

  this.window.on('devtools-opened', function(e) {
    this.window.webContents.send('window:toggle-dev-tools', true);
  }.bind(this));

  this.window.on('devtools-closed', function(e) {
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
    this.setupConnector();
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

AppWindow.prototype.setupConnector = function() {
  this.child = fork(path.join(__dirname, 'yo.js'));

  this.child.on('message', function (msg) {
    console.log('APP', msg);

    this.window.webContents.send.apply(this.window.webContents, [msg.event, msg.data]);

  }.bind(this));

  this.sendToChild('generator:init');
};

AppWindow.prototype.sendToChild = function (name) {
  var args = Array.prototype.slice.call(arguments, 1);

  if (name === 'generator:cancel') {
    kill(this.child.pid, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log('Killed yeoman process');
    });

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

  this.child.send({
    action: name,
    args: args
  });
};

module.exports = AppWindow;
