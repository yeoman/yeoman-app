'use strict';

var app = require('app');
var Application = require('./application');

var shellStartTime = Date.now();

process.on('uncaughtException', function(error) {
  if (error == null) {
    error = {};
  }

  if (error.message != null) {
    console.error(error.message);
  }

  if (error.stack != null) {
    console.error(error.stack);
  }
});

// Enable ES6 in the Renderer process
app.commandLine.appendSwitch('js-flags', '--harmony');

// Note: It's important that you don't do anything with Electron
// unless it's after 'ready', or else mysterious bad things will happen
// to you.
app.on('ready', function() {
  var Application = require('./application');
  new Application();

  console.log('App load time: ' + (Date.now() - shellStartTime) + 'ms');
});
