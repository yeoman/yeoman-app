'use strict';

var debug = require('debug')('yoapp:connector');
var fs = require('fs');
var util = require('util');
var events = require('events');
var _ = require('lodash');
var findup = require('findup-sync');
var ipc = require('ipc');
var GUIAdapter = require('./helpers/adapter');
var yoEnvironment = require('./yo-environment');
var dialogs = require('./helpers/dialogs');
var env;

var Connector = module.exports = function Connector(browserWindow) {
  events.EventEmitter.call(this);

  var webContents = browserWindow.webContents;

  this.init(webContents, function(err, _env) {
    env = _env;
    var generators = this.getGeneratorsData();
    webContents.send('generators-data', generators);

    ipc.on('connect', function (event, generatorName, cwd) {
      debug('Event: connect');
      debug('Run generator %s in %s', generatorName, cwd);

      this.connect(webContents, generatorName, cwd);
    }.bind(this));

    ipc.on('set-answers', function (event, answers) {
      env.adapter.answers(answers);
    });
  }.bind(this));

  dialogs.start(browserWindow, webContents);
};

util.inherits(Connector, events.EventEmitter);

Connector.prototype.init = function(webContents, cb) {
  var adapter = new GUIAdapter(webContents);
  var env = yoEnvironment([], {}, adapter);
  env.lookup(function(err) {
    if (err) return cb(err);
    cb(null, env);
  });
};

Connector.prototype.getGeneratorsData = function() {
   var generatorsMeta = env.store.getGeneratorsMeta();

   // Remove sub generators from list
   var list = _.filter(generatorsMeta, function(item) {
    return item.namespace.split(':')[1] === 'app';
  });

   list = list.map(function(item) {
    var pkgPath = findup('package.json', {cwd: item.resolved});
    if (pkgPath) {
      var pkg = JSON.parse(fs.readFileSync(pkgPath));

      // Indicator to verify official generators
      pkg.officialGenerator = false;
      if (pkg.repository && pkg.repository.url) {
        pkg.officialGenerator = pkg.repository.url.indexOf('github.com/yeoman/') > -1;
      }

      return _.pick(pkg, 'name', 'version', 'description', 'officialGenerator');
    }
    return null;
  });
  return _.compact(list);
};

Connector.prototype.connect = function(webContents, generatorName, targetDir) {

  var name = generatorName.split('generator-')[1];
  var doneCounter = 0;
  var doneCalled = false;

  var done = function(err) {
    if (doneCalled) return;

    if (err) {
      doneCalled = true;
      return webContents.send('generator-error', err);
    }

    if (doneCounter === 0) {
      doneCalled = true;
      webContents.send('generator-done');
    }
  };

  var increaseDoneCounter = function() {
    doneCounter++;
  };

  var decreaseDoneCounter = function() {
    doneCounter--;
    done();
  };

  process.chdir(targetDir);

  // TODO:
  // Optimize done handling for yeoman-generators >= 0.17
  // https://github.com/yeoman/yeoman-app/issues/10#issuecomment-62968879
  env.run(name, done)
    .on('npmInstall', increaseDoneCounter)
    .on('bowerInstall', increaseDoneCounter)
    .on('npmInstall:end', decreaseDoneCounter)
    .on('bowerInstall:end', decreaseDoneCounter);
};
