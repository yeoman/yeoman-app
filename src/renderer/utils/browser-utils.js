'use strict';

var ipc = require('ipc');

var BrowserActions = require('../actions/browser-actions');
var GeneratorStore = require('../stores/generator-store');
var PromptStore = require('../stores/prompt-store');


function onSelectFolder() {
  ipc.send('context-generator', 'generator:open-dialog');
}

function onSubmitForm(answers) {
  ipc.send('context-generator', 'generator:promptAnswer', answers);
}

function onSubmitSelectedFolder(generatorName, answers){
  ipc.send('context-generator', 'generator:run', generatorName, answers.cwd);
}

// Sets user generated events to trigger browser actions
PromptStore.events.on('select-folder', onSelectFolder);
GeneratorStore.events.on('submit-form', onSubmitForm);
GeneratorStore.events.on('submit-selected-folder', onSubmitSelectedFolder);


// List events to listen from browser and broadcast to view
var BrowserUtils = {
  'generator:generators': 'generatorsDataReceived',
  'generator:prompt': 'questionPrompt',
  'generator:done': 'generatorDone',
  'generator:directory-selected': 'folderSelected'
};

Object.keys(BrowserUtils).forEach(function (key) {

  ipc.on(key, function (data) {

    BrowserActions[BrowserUtils[key]](data);
  });
});


module.exports = BrowserUtils;