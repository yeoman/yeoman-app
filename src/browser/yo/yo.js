var fs = require('fs');
var _ = require('lodash');
var findup = require('findup-sync');
var semver = require('semver');
var environment = require('./environment');

var env = null;

function sendCommandToAppWindow(name, data) {
  if (data instanceof Error) {
    console.error(data);
    data = data.toString();
  }
  process.send({
    event: name,
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
    if (!pkgPath) {
      return null;
    }

    var pkg = JSON.parse(fs.readFileSync(pkgPath));
    var generatorVersion = pkg.dependencies['yeoman-generator'];
    var generatorMeta = _.pick(pkg, 'name', 'version', 'description');

    // Flag generator to indecate if the generator version is fully supported or not.
    // https://github.com/yeoman/yeoman-app/issues/16#issuecomment-121054821
    generatorMeta.isCompatible = semver.ltr('0.17.6', generatorVersion);

    // Indicator to verify official generators
    generatorMeta.officialGenerator = false;
    if (generatorMeta.repository && generatorMeta.repository.url) {
      generatorMeta.officialGenerator = generatorMeta.repository.url.indexOf('github.com/yeoman/') > -1;
    }

    return generatorMeta;
  });
  return _.compact(list);
}

function init() {
  env = environment();

  env.lookup(function () {
    sendCommandToAppWindow('generator:installed-generators', getGenerators());
  });
}

function run(generatorName, cwd) {

  if (!generatorName) {
    return sendCommandToAppWindow('generator:error', new Error('You must provide a generator name'));
  }

  if (!fs.existsSync(cwd)) {
    return sendCommandToAppWindow('generator:error', new Error('The given path does not exist or is not a directory'));
  }

  process.chdir(cwd);

  var prefix = 'generator-';
  if (generatorName.indexOf(prefix) === 0) {
    generatorName = generatorName.slice(prefix.length);
  }

  function done(err) {
    if (err) {
      return sendCommandToAppWindow('generator:error', err);
    }
  }

  var triggerInstall = _.once(_.partial(sendCommandToAppWindow, 'generator:install'));

  env.run(generatorName, done)
    .on('npmInstall', triggerInstall)
    .on('bowerInstall', triggerInstall)
    .on('end', function () {
      sendCommandToAppWindow('generator:done', cwd);
    });
}

function promptAnswer(answer) {
  env.adapter.answerCallback(answer);
}

var api = {
  'generator:init': init,
  'generator:run': run,
  'generator:prompt-answer': promptAnswer
};

process.on('message', function (msg) {
  console.log('YO-Process', msg);

  var action = api[msg.action];
  if (action) {
    action.apply(null, msg.args);
  } else {
    console.warn('No action "%s" in api found', msg.action);
  }
});
