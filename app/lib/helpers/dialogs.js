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

function start(browserWindow, client) {
  ipc.on('prompts.folder.getFolder',
    showSelectDirDialog.bind({}, browserWindow, function (filenames) {
      client.send('helpers.dialogs.selectDir', filenames.shift());
    }));
}


module.exports = {
  start: start
};

