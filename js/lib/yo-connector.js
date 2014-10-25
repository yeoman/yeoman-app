'use strict';

var yo = require('yeoman-environment');
var GUIAdapter = require('./helpers/adapter');

var env;
var gen;


function connect(generatorName, targetDir, callback) {

    var opts = { cwd: targetDir };

    env = yo.createEnv([], opts, new GUIAdapter(callback));
    gen = env.instantiate(require(generatorName));
}

function run() {
    gen.run();
}

function setAnswers(answers) {
    return env.adapter.answers(answers);
}


module.exports = {
    connect: connect,
    run: run,
    setAnswers: setAnswers
};

