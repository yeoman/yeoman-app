var fs = require('fs-plus');
var path = require('path');
var electron = require('electron');
var app = electron.remote.app;
var newLine = require('os').EOL;

var specRootPath = path.resolve(__dirname, '..');

if (global.loadSettings.exitWhenDone) {
  var jasmineFn = require('jasmine');
  jasmineFn(global.jasmine);
  var out = '';
  var reporter = new jasmineFn.ConsoleReporter({
    print: function (str) {
      if (str === newLine) {
        electron.remote.getGlobal('console').log(out);
        out = '';
        return;
      }
      out += str;
    },

    onComplete: function (allPassed) {
      return app.exit(allPassed ? 0 : 1);
    }
  });

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.addReporter(reporter);
  fs.listTreeSync(specRootPath).forEach(function (specFilePath) {
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

  window.getJasmineRequireObj = undefined;
  window.jasmineRequire = require('../../vendor/jasmine/lib/jasmine-2.1.3/jasmine');
  require('../../vendor/jasmine/lib/jasmine-2.1.3/jasmine-html');
  require('../../vendor/jasmine/lib/jasmine-2.1.3/boot');

  fs.listTreeSync(specRootPath).forEach(function (specFilePath) {
    if (/-spec\.js$/.test(specFilePath)) {
      require(specFilePath);
    }
  });

  window.jasmineExecute();
}
