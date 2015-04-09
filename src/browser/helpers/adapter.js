'use strict';

var logger = require('yeoman-environment/lib/util/log');

var GUIAdapter = module.exports = function GUIAdapter(appWindow) {
  this.appWindow = appWindow;
};

GUIAdapter.prototype.prompt = function (questions, callback) {
  console.log('Send generator:prompt-questions: ', questions);

  this.appWindow.sendCommandToBrowserWindow('generator:prompt-questions', questions);
  this.callback = callback;
};

GUIAdapter.prototype.answers = function (answers) {
  console.log('Set answers: %s', answers);

  this.callback(answers);
};

GUIAdapter.prototype.diff = function () {
  //TODO: Implement diff
};

//TODO: Implement logger
GUIAdapter.prototype.log = logger();
