'use strict';

var logger = require('yeoman-environment/lib/util/log');

function GUIPrompt(q) {
    this.answer = null;
    this.question = q;
}

GUIPrompt.prototype.run = function (cb) {
    // we should get the answer from the front-end before calling cb
    cb(this.answer || this.question.default);
};

function GUIAdapter() {

    function promptModule(questions, allDone) {
        // return user's answers here
        allDone({});
    }

    promptModule.prompts = {
        list: {},
        input: {},
        confirm: {},
        rawlist: {},
        expand: {},
        checkbox: {},
        password: {}
    };

    promptModule.registerPrompt = function (name, Prompt) {
        this.prompts[name] = Prompt;
        return this;
    };

    this.prompt = promptModule;

    Object.keys(this.prompt.prompts).forEach(function (promptName) {
        this.prompt.registerPrompt(promptName, GUIPrompt);
    }, this);

    this.diff = function () {};
    this.log = logger();
}

module.exports = GUIAdapter;

