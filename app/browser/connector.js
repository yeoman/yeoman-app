'use strict';

var fs = require('fs');
var util = require('util');
var events = require('events');
var _ = require('lodash');
var findup = require('findup-sync');
var ipc = require('ipc');
var GUIAdapter = require('./helpers/adapter');
var yoEnvironment = require('./environment');
var dialogs = require('./helpers/dialogs');

var Connector = module.exports = function Connector(appWindow) {
  events.EventEmitter.call(this);

  this.appWindow = appWindow;

  this.init(function(err) {
    var generators = this.getGeneratorsData();
    this.appWindow.sendCommandToBrowserWindow('generator:data', generators);

    appWindow.on('generator:init', function (generatorName, cwd) {
      this.appWindow.log.debug('Run generator %s in %s', generatorName, cwd);

      this.connect(generatorName, cwd);
    }.bind(this));

    appWindow.on('generator:prompt-answers', function (answers) {
      this.env.adapter.answers(answers);
    }.bind(this));
  }.bind(this));

  dialogs.start(this.appWindow);
};

util.inherits(Connector, events.EventEmitter);

Connector.prototype.init = function(cb) {
  var adapter = new GUIAdapter(this.appWindow, this.appWindow.log);
  this.env = yoEnvironment([], {}, adapter);
  this.env.lookup(function(err) {
    if (err) return cb(err);
    cb(null);
  });
};

Connector.prototype.getGeneratorsData = function() {
   var generatorsMeta = this.env.store.getGeneratorsMeta();

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

Connector.prototype.connect = function(generatorName, targetDir) {

  var name = generatorName.split('generator-')[1];
  var doneCounter = 0;
  var doneCalled = false;

  var done = function(err) {
    if (doneCalled) return;

    if (err) {
      doneCalled = true;
      return this.appWindow.sendCommandToBrowserWindow('generator:error', err);
    }

    if (doneCounter === 0) {
      doneCalled = true;
      this.appWindow.sendCommandToBrowserWindow('generator:done');
    }
  }.bind(this);

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
  this.env.run(name, done)
    .on('npmInstall', increaseDoneCounter)
    .on('bowerInstall', increaseDoneCounter)
    .on('npmInstall:end', decreaseDoneCounter)
    .on('bowerInstall:end', decreaseDoneCounter);
};
