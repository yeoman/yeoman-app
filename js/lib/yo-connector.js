'use strict';

var yo = require('yeoman-environment');
var GUIAdapter = require('./helpers/adapter');

function connect(generatorName) {

    var env = yo.createEnv([], {}, new GUIAdapter());
    var gen = env.instantiate(require(generatorName));

    gen.run();
}

module.exports = {
    connect: connect
};

