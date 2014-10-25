'use strict';

var yo = require('yeoman-environment');
var GUIAdapter = require('./helpers/adapter');

var gen;


function connect(generatorName, targetDir, callback) {

    var opts = { cwd: targetDir };
    var env = yo.createEnv([], opts, new GUIAdapter(callback));

    gen = env.instantiate(require(generatorName));
}

function run() {
    gen.run();
}


module.exports = {
    connect: connect,
    run: run
};

