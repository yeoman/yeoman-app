#!/usr/bin/env node

var path = require('path');
var proc = require('child_process')
var electron = require('electron-prebuilt')

var args = [path.resolve(__dirname, '..'), '--test'];
var opts = { stdio: 'inherit' };
var child = proc.spawn(electron, args, opts);

child.on('exit', function (exitCode) {
  process.exit(exitCode);
});
