#!/usr/bin/env node

const path = require('path');
const proc = require('child_process');

const args = [path.resolve(__dirname, '..'), '-r', '--test'];
const opts = { stdio: 'inherit' };
const child = proc.spawn('electron', args, opts);

child.on('exit', (exitCode) => {
  process.exit(exitCode);
});
