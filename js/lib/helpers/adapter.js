'use strict';

var logger = require('yeoman-environment/lib/util/log');
var inquirer = require('inquirer');

function GUIPrompt(q) {
    this.question = q;
}

GUIPrompt.prototype.run = function (cb) {
    // we should get the answer from the front-end before calling cb
    //cb(answerReceived || this.question.default);
};

function GUIAdapter() {

    this.prompt = inquirer.createPromptModule();

    Object.keys(this.prompt.prompts).forEach(function (promptName) {
        this.prompt.registerPrompt(promptName, GUIPrompt);
    }, this);

    this.diff = function () {};
    this.log = logger();
}

module.exports = GUIAdapter;

