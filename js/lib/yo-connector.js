'use strict';

var yo = require('yeoman-environment');
var GUIAdapter = require('./helpers/adapter');

var gen;


function connect(generatorName, targetDir) {

    var opts = { cwd: targetDir };
    var env = yo.createEnv([], opts, new GUIAdapter());

    gen = env.instantiate(require(generatorName));

    return gen;
}

function run() {
    gen.run();
}


module.exports = {
    connect: connect,
    run: run
};

