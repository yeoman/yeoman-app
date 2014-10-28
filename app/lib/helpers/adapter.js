'use strict';

var events = require('events');

var _ = require('lodash');
var logger = require('yeoman-environment/lib/util/log');


function GUIAdapter(questionsCallback) {

    var callback;

    _.extend(this, events.EventEmitter.prototype);


    this.prompt = function (questions, allDone) {
        questionsCallback(questions);
        callback = allDone;
    };

    this.answers = function (answers) {
        callback(answers);
    };

    this.diff = function () {};
    this.log = logger();
}


module.exports = GUIAdapter;

