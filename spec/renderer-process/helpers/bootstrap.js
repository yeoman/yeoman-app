'use strict';

var fs = require('fs-plus');
var path = require('path');
var remote = require('remote');
var app = remote.require('app');
var pkgJson = require('../../../package.json');

// Start the crash reporter before anything else
require('crash-reporter').start({
  productName: pkgJson.name,
  companyName: 'atom-shell-starter'
});

var specRootPath = path.resolve(__dirname, '..');

if (global.loadSettings.exitWhenDone) {
  var jasmineFn = require('jasmine');
  jasmineFn(global.jasmine);
  var reporter = new jasmineFn.ConsoleReporter({
    print: function (str) {
      return process.stdout.write(str);
    },

    onComplete: function (allPassed) {
      return app.exit(allPassed ? 0 : 1);
    }
  });

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.addReporter(reporter);
  var specFiles = fs.listTreeSync(specRootPath);
  specFiles.forEach(function (specFilePath) {
    if (/-spec\.js$/.test(specFilePath)) {
      require(specFilePath);
    }
  });

  jasmineEnv.execute();
} else {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../vendor/jasmine/lib/jasmine-2.1.3/jasmine.css';
  document.head.appendChild(link);
  window.jasmineRequire = require('../../../vendor/jasmine/lib/jasmine-2.1.3/jasmine');
  require('../../../vendor/jasmine/lib/jasmine-2.1.3/jasmine-html');
  require('../../../vendor/jasmine/lib/jasmine-2.1.3/boot');

  require('node-jsx').install({ extension: '.jsx', harmony: true });

  var specFiles = fs.listTreeSync(specRootPath);
  specFiles.forEach(function (specFilePath) {
    if (/-spec\.js$/.test(specFilePath)) {
      require(specFilePath);
    }
  });

  window.jasmineExecute();
}
