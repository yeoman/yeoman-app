'use strict';

var ipc = require('ipc');

var BrowserActions = require('../actions/browser-actions');


// List events to listen from browser and broadcast to view
var BrowserUtils = {
  'generators-data': 'generatorsDataReceived',
  'question-prompt': 'questionPrompt',
  'generator-done': 'generatorDone'
};

Object.keys(BrowserUtils).forEach(function (key) {

  ipc.on(key, function (data) {

    BrowserActions[BrowserUtils[key]](data);
  });
});


module.exports = BrowserUtils;

