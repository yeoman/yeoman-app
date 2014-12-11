'use strict';

var debug = require('debug')('yoapp:adapter');
var logger = require('yeoman-environment/lib/util/log');

var GUIAdapter = module.exports = function GUIAdapter(appWindow) {
  this.appWindow = appWindow;
};

GUIAdapter.prototype.prompt = function (questions, callback) {
  debug('IPC: Send question-prompt with %o', questions);

  this.appWindow.emit('connector:generator-prompt', questions);
  this.callback = callback;
};

GUIAdapter.prototype.answers = function (answers) {
  debug('Set answers: %s', answers);

  this.callback(answers);
};

GUIAdapter.prototype.diff = function () {
  //TODO: Implement diff
};

//TODO: Implement logger
GUIAdapter.prototype.log = logger();
