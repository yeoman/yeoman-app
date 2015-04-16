
// Warning: You almost certainly do *not* want to edit this code - instead, you
// want to edit src/renderer/main.coffee instead
window.onload = function() {
  try {
    var startTime = Date.now();

    // Skip "?loadSettings=".
    var loadSettings = JSON.parse(decodeURIComponent(location.search.substr(14)));

    // Require before the module cache in dev mode
    if (loadSettings.devMode) {
      require('coffee-script').register();
      require('../src/babel').register();
    }

    require('vm-compatibility-layer');

    if (!loadSettings.devMode) {
      require('coffee-script').register();
      require('../src/babel').register();
    }

    require('../src/coffee-cache').register();

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
