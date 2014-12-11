'use strict';

var ipc = require('ipc');
var dialog = require('dialog');


function showSelectDirDialog(browserWindow, callback) {

  var opts = {
    title: 'Select a folder to generate the project into',
    properties: ['openDirectory', 'createDirectory']
  };

  dialog.showOpenDialog(browserWindow, opts, callback);
}

function start(appWindow) {
  ipc.on('prompts.folder.getFolder',
    showSelectDirDialog.bind({}, appWindow.browserWindow, function (filenames) {
      if (!filenames) return;

      appWindow.emit('connector:directory-selected', filenames.shift());
    }));
}

module.exports = {
  start: start
};

