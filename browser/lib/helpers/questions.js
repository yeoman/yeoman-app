'use strict';

var _ = require('lodash');


var getFolderPrompt = [{
    message: 'Please specify a folder to be used to generate the project',
    name: 'cwd',
    type: 'folder'
}];

var htmlTypes = {
    folder: {
        promptType: 'folder',
        htmlType: 'file'
    },
    input: {
        promptType: 'input',
        htmlType: 'text'
    },
    password: {
        promptType: 'input',
        htmlType: 'password'
    },
    confirm: {
        promptType: 'checkbox',
        htmlType: 'checkbox'
    },
    list: {
        promptType: 'select',
        htmlType: 'select',
        optType: 'option'
    },
    rawlist: {
        promptType: 'radioList',
        htmlType: 'div',
        optType: 'radio'
    },
    expand: {
        promptType: 'radioList',
        htmlType: 'div',
        optType: 'radio'
    },
    checkbox: {
        promptType: 'checkboxList',
        htmlType: 'div',
        optType: 'checkbox'
    }
};

function convertToHtml(questions) {
    return questions.map(function (originalQuestion) {
        if (originalQuestion.type in htmlTypes) {
            return _.merge(originalQuestion, htmlTypes[originalQuestion.type]);
        } else {
            return originalQuestion;
        }
    });
}


module.exports = {
    convertToHtml: convertToHtml,
    getFolderPrompt: getFolderPrompt
};

