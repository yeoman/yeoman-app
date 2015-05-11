'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var packager = require('electron-packager');
var pkg = require('../package.json');

var options = {
  name: pkg.productName,
  'app-version': pkg.version,
  'app-bundle-id': pkg.appBundleId,
  'helper-bundle-id': pkg.helperBundleId,
  out: path.join(__dirname, '..', 'build'),
  icon: path.join(__dirname, '..', 'resources', 'app.icns'),
  asar: true,
  prune: true,
  dir: '.',
  ignore: [
    'node_modules/electron-prebuilt',
     'node_modules/electron-packager',
     '.git'
  ]
};

rimraf.sync(options.out);
mkdirp.sync(options.out);

packager(options, function(err, appPath) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.error('Wrote %s app to %s', pkg.productName, appPath);
});
