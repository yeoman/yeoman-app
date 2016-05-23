const electron = require('electron');
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const path = require('path');
const url = require('url');
const EventEmitter = require('events').EventEmitter;
const fork = require('child_process').fork;
const _ = require('underscore-plus');
const killChildProcess = require('./util/kill-childprocess');

function AppWindow(options) {
  this.loadSettings = {
    bootstrapScript: require.resolve('../renderer/main')
  };
  this.loadSettings = _.extend(this.loadSettings, options);

  var windowOpts = {
    webPreferences: {
      subpixelFontScaling: true,
      directWrite: true
    }
  };
  windowOpts = _.extend(windowOpts, this.loadSettings);

  this.window = new BrowserWindow(windowOpts);
  this.handleEvents();
}

_.extend(AppWindow.prototype, EventEmitter.prototype);

AppWindow.prototype.show = function () {
  var targetPath = path.resolve(__dirname, '..', '..', 'static', 'index.html');
  var targetUrl = url.format({
    protocol: 'file',
    pathname: targetPath,
    slashes: true,
    query: {
      loadSettings: JSON.stringify(this.loadSettings)
    }
  });
  this.window.loadURL(targetUrl);

  this.window.webContents.on('did-finish-load', function () {
    this.initYoProcess();
  }.bind(this));

  this.window.show();
};

AppWindow.prototype.reload = function () {
  this.window.webContents.reload();
};

AppWindow.prototype.toggleFullScreen = function () {
  this.window.setFullScreen(!this.window.isFullScreen());
};

AppWindow.prototype.toggleDevTools = function () {
  this.window.toggleDevTools();
};

AppWindow.prototype.close = function () {
  this.window.close();
  this.window = null;
};

AppWindow.prototype.handleEvents = function () {

  this.window.on('closed', function (e) {
    this.emit('closed', e);
  }.bind(this));

  this.on('generator-cancel', this.killYoProcess);
  this.on('open-dialog', this.selectTargetDirectory);
  this.on('generator:done', this.openProject);
};

AppWindow.prototype.selectTargetDirectory = function () {
  var opts = {
    title: 'Select a folder to generate the project into',
    properties: ['openDirectory', 'createDirectory']
  };

  dialog.showOpenDialog(this.window, opts, function (filenames) {
    if (!filenames) {
      return;
    }
    this.sendCommandToBrowserWindow('generator:directory-selected', filenames.shift());
  }.bind(this));
};

AppWindow.prototype.openProject = function (cwd) {
  if (!cwd) {
    return;
  }

  shell.showItemInFolder(cwd);
};

AppWindow.prototype.initYoProcess = function () {
  if (this.loadSettings.isSpec) {
    return;
  }

  this.yoProcess = fork(path.join(__dirname, 'yo', 'yo.js'));

  this.yoProcess.on('message', function (msg) {
    console.log('APP', msg);

    this.sendCommandToBrowserWindow(msg.event, msg.data);
    this.emitCommandToAppWindow(msg.event, msg.data);

  }.bind(this));

  this.sendCommandToProcess('generator:init');
};

AppWindow.prototype.killYoProcess = function () {
  if (this.yoProcess && this.yoProcess.pid) {
    killChildProcess(this.yoProcess.pid, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
};

AppWindow.prototype.emitCommandToAppWindow = function (event, data) {
  if (!event) {
    return;
  }

  this.emit(event, data);
};

AppWindow.prototype.sendCommandToBrowserWindow = function () {
  this.window.webContents.send.apply(this.window.webContents, arguments);
};

AppWindow.prototype.sendCommandToProcess = function (name) {
  var args = Array.prototype.slice.call(arguments, 1);

  this.yoProcess.send({
    action: name,
    args: args
  });
};

module.exports = AppWindow;
