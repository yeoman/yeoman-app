'use strict';

// Warning: You almost certainly do *not* want to edit this code - instead, you
// want to edit src/renderer/main.js instead
window.onload = function() {
  try {
    var startTime = Date.now();

    // Skip "?loadSettings=".
    var loadSettings = JSON.parse(decodeURIComponent(window.location.search.substr(14)));

    require('vm-compatibility-layer');

    window.loadSettings = loadSettings;

    require(loadSettings.bootstrapScript);
    require('ipc').sendChannel('window-command', 'window:loaded');
  }
  catch (error) {
    var currentWindow = require('remote').getCurrentWindow();
    currentWindow.setSize(800, 600);
    currentWindow.center();
    currentWindow.show();
    currentWindow.openDevTools();

    console.error(error.stack || error);
  }
};
