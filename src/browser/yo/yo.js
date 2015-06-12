'use strict';

var fs = require('fs');
var _ = require('lodash');
var findup = require('findup-sync');
var environment = require('./environment');

var env = null;

function sendCommandToAppWindow(name, data) {
  process.send({
    event: 'generator:' + name,
    data: data
  });
}

function getGenerators() {
  var generatorsMeta = env.store.getGeneratorsMeta();

  // Remove sub generators from list
  var list = _.filter(generatorsMeta, function (item) {
    return item.namespace.split(':')[1] === 'app';
  });

  list = list.map(function (item) {
    var pkgPath = findup('package.json', { cwd: item.resolved });
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

function init () {
  env = environment();

  env.lookup(function () {
    sendCommandToAppWindow('generators', getGenerators());
  });
}

function run (generatorName, cwd) {

  process.chdir(cwd);
  console.log(process.cwd());

  var prefix = 'generator-';
  if (generatorName.indexOf(prefix) === 0) {
    generatorName = generatorName.slice(prefix.length);
  }

  var doneCounter = 0;
  var doneCalled = false;

  function done(err) {
    if (doneCalled) {
      return;
    }

    if (err) {
      doneCalled = true;
      return sendCommandToAppWindow('error', err);
    }

    if (doneCounter === 0) {
      doneCalled = true;
      sendCommandToAppWindow('done');
    }
  }

  function increaseDoneCounter(eventName) {
    doneCounter++;
    sendCommandToAppWindow(eventName);
  }

  function decreaseDoneCounter(eventName) {
    doneCounter--;
    sendCommandToAppWindow(eventName);
    done();
  }

  var triggerInstall = _.once(_.partial(sendCommandToAppWindow, 'install'));

  env.run(generatorName, done)
    .on('npmInstall', triggerInstall)
    .on('bowerInstall', triggerInstall)

    // In generators < v0.18 the done callback is triggered too early.
    // We count the callbacks of *Install and *Install:end to solve that issue.
    // https://github.com/yeoman/yeoman-app/issues/10#issuecomment-62968879
    .on('npmInstall', _.wrap('npmInstall', increaseDoneCounter))
    .on('bowerInstall', _.wrap('bowerInstall', increaseDoneCounter))
    .on('npmInstall:end', _.wrap('npmInstall:end', decreaseDoneCounter))
    .on('bowerInstall:end', _.wrap('bowerInstall:end', decreaseDoneCounter));
}

function promptAnswer (answer) {
  env.adapter.answerCallback(answer);
}

var api = {
  init: init,
  run: run,
  promptAnswer: promptAnswer
};

process.on('message', function (msg) {
  console.log('YO-Process', msg);

  msg.action = msg.action.split('generator:')[1];

  if (typeof api[msg.action] === 'function') {
    api[msg.action].apply(null, msg.args);
  } else {
    console.warn('No action "%s" in api found', msg.action);
  }
});
