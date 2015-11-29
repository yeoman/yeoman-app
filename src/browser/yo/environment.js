var path = require('path');
var yo = require('yeoman-environment');
var Adapter = require('./adapter');

var win32 = process.platform === 'win32';

var getNpmPaths = function () {

  if (process.env.NODE_PATH) {
    return process.env.NODE_PATH.split(path.delimiter);
  }

  require('fix-path')();

  // Get the npm path from the user env variables.
  var paths = process.env.PATH.split(path.delimiter).map(function (item) {
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

module.exports = function (args, opts) {
  args = args || [];
  opts = opts || {};

  var env = yo.createEnv(args, opts, new Adapter());

  // TODO:
  // Consider a better approach to get the npm pahts.
  // Perhapps the original getNpmPaths method needs to
  // be extend with functonality.
  // https://github.com/yeoman/environment/blob/8cf0c657e0edbbfd1e64d98f58d912dab1910720/lib/resolver.js#L101
  env.getNpmPaths = getNpmPaths;

  return env;
};
