'use strict';

var fs = require('fs');
var _ = require('lodash');
var findup = require('findup-sync');
var ipc = require('ipc');
var GUIAdapter = require('./helpers/adapter');
var yoEnvironment = require('./yo-env');
var dialogs = require('./helpers/dialogs');
var env;

function init(client, cb) {

  var questionCallback = function (questions) {
    client.send('question-prompt', questions);
  };
  var adapter = new GUIAdapter(questionCallback);
  yoEnvironment(adapter, cb);
}

function getGeneratorsData() {
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
}

function connect(client, generatorName, targetDir) {

  var name = generatorName.split('generator-')[1];
  var doneCounter = 0;
  var doneCalled = false;

  var done = function(err) {
    if (doneCalled) return;

    if (err) {
      doneCalled = true;
      return client.send('generator-error', err);
    }

    if (doneCounter === 0) {
      doneCalled = true;
      client.send('generator-done');
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

  env.run(name, done)
    .on('npmInstall', increaseDoneCounter)
    .on('bowerInstall', increaseDoneCounter)
    .on('npmInstall:end', decreaseDoneCounter)
    .on('bowerInstall:end', decreaseDoneCounter);
}

function setAnswers(answers) {
  return env.adapter.answers(answers);
}

function start(browserWindow, client) {

  client.on('did-finish-load', function () {

    init(client, function(err, _env) {
      env = _env;
      var generators = getGeneratorsData();
      client.send('generators-data', generators);

      ipc.on('connect', function (event, generatorName, cwd) {
        connect(client, generatorName, cwd);
      });

      ipc.on('set-answers', function (event, answers) {
        setAnswers(answers);
      });
    });
  });

  dialogs.start(browserWindow, client);
}

module.exports = {
  start: start
};

