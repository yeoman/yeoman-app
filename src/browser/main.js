var app  = require('app');
var path = require('path');
var fs   = require('fs');

// ROOT/src/browser/../../cache
var cachePath = path.join(__dirname, '..', '..', 'cache');
var devMode = (process.argv || []).indexOf('-r') !== -1;

// Note: It's important that you don't do anything with Electron
// unless it's after 'ready', or else mysterious bad things will happen
// to you.
app.on('ready', function () {
  // Enable ES6 from this point on
  if (fs.statSyncNoException(cachePath) && !devMode) {
    require('electron-compile').initForProduction(cachePath);
  } else {
    require('electron-compile').init();
  }

  require('./app');
});