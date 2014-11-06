'use strict';

var path = require('path');
var yo = require('yeoman-environment');
var GUIAdapter = require('./helpers/adapter');

var ipc = require('ipc');
var generatorsData = require('./generators-data');
var dialogs = require('./helpers/dialogs');

var win32 = process.platform === 'win32';
var env;

function connect(client, generatorName, targetDir) {

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

  // TODO:
  // Consider a better approach to get the npm pahts.
  // Perhapps the original getNpmPaths method needs to
  // be extend with functonality.
  // https://github.com/yeoman/environment/blob/8cf0c657e0edbbfd1e64d98f58d912dab1910720/lib/resolver.js#L101
  env.getNpmPaths = function() {

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

  env.lookup(function () {
    console.log(env.store.namespaces());
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

