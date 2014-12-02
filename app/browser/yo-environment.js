'use strict';

var path = require('path');
var yo = require('yeoman-environment');
var win32 = process.platform === 'win32';

var getNpmPaths = function() {

  if (process.env.NODE_PATH) {
    return process.env.NODE_PATH.split(path.delimiter);
  }

  // Get the npm path from the user env variables.
  var paths = process.env.PATH.split(path.delimiter).map(function(item) {
    return path.join(item, '..', 'lib', 'node_modules');
  });

  // Default paths for each system
  if (win32) {
    paths.push(path.join(process.env.APPDATA, 'npm/node_modules'));
  } else {
    paths.push('/usr/lib/node_modules');
  }

  return paths.reverse();
};

module.exports = function (args, opts, adapter) {

  var env = yo.createEnv(args, opts, adapter);

  // TODO:
  // Consider a better approach to get the npm pahts.
  // Perhapps the original getNpmPaths method needs to
  // be extend with functonality.
  // https://github.com/yeoman/environment/blob/8cf0c657e0edbbfd1e64d98f58d912dab1910720/lib/resolver.js#L101
  env.getNpmPaths = getNpmPaths;

  return env;
};
