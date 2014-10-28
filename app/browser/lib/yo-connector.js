'use strict';

var yo = require('yeoman-environment');
var GUIAdapter = require('./helpers/adapter');
var pkgData = require('../../package');

var env;


function connect(generatorName, targetDir, questionCallback, done) {

    var opts = { cwd: targetDir };
    var name = generatorName.split('generator-')[1];

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


module.exports = {
    connect: connect,
    setAnswers: setAnswers
};

