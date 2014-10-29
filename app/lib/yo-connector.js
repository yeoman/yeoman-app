'use strict';

var yo = require('yeoman-environment');
var GUIAdapter = require('./helpers/adapter');
var pkgData = require('../../package');

var ipc = require('ipc');
var generatorsData = require('./generators-data');
var dialogs = require('./helpers/dialogs');

var env;


function connect(client, generatorName, targetDir) {

  console.log('connect');
  console.log(client);
  console.log(generatorName);
  console.log(targetDir);

  var opts = { cwd: targetDir };
  var name = generatorName.split('generator-')[1];
  var questionCallback = function (questions) {
    client.send('question-prompt', questions);
  };
  var done = function () {
    client.send('generator-done');
  };

  process.chdir(targetDir);

  env = yo.createEnv([], opts, new GUIAdapter(questionCallback));

  env.lookup(function () {
    // Register all local generators
    Object.keys(pkgData.dependencies)
      .filter(function (depName) {
        return depName.indexOf('generator-') === 0;
      }).forEach(function (depName) {
        env.register(depName);
      });

    env.run(name, done);
  });
}

function setAnswers(answers) {
  return env.adapter.answers(answers);
}

function start(browserWindow, client) {

  client.on('did-finish-load', function () {

    client.send('generators-data', generatorsData.getOfficialGenerators());

    ipc.on('connect', function (event, generatorName, cwd) {
      connect(client, generatorName, cwd);
    });

    ipc.on('set-answers', function (event, answers) {
      setAnswers(answers);
    });

  });

  dialogs.start(browserWindow, client);
}


module.exports = {
  start: start
};

