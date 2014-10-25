'use strict';

var logger = require('yeoman-environment/lib/util/log');

function GUIAdapter() {

    function promptModule(questions, allDone) {
        // return user's answers here
        allDone({});
    }

    this.prompt = promptModule;

    this.diff = function () {};
    this.log = logger();
}

module.exports = GUIAdapter;

