'use strict';

var ipc = require('ipc');

var BrowserActions = require('../actions/browser-actions');
var GeneratorStore = require('../stores/generator-store');
var PromptStore = require('../stores/prompt-store');


function onSelectFolder() {
  ipc.send('prompts.folder.getFolder');
}

// Sets user generated events to trigger browser actions
PromptStore.events.on('select-folder', onSelectFolder);


// List events to listen from browser and broadcast to view
var BrowserUtils = {
  'generators-data': 'generatorsDataReceived',
  'question-prompt': 'questionPrompt',
  'generator-done': 'generatorDone',
  'helpers.dialogs.selectDir': 'folderSelected'
};

Object.keys(BrowserUtils).forEach(function (key) {

  ipc.on(key, function (data) {

    BrowserActions[BrowserUtils[key]](data);
  });
});


module.exports = BrowserUtils;

