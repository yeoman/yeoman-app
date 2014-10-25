'use strict';

var events = require('events');

var _ = require('lodash');
var logger = require('yeoman-environment/lib/util/log');


function GUIAdapter() {

    var callback;

    _.extend(this, events.EventEmitter.prototype);


    this.prompt = function (questions, allDone) {
        this.emit(questions);
        callback = allDone;
    };

    this.answers = function (answers) {
        callback(answers);
    };

    this.diff = function () {};
    this.log = logger();
}


module.exports = GUIAdapter;

