'use strict';

var _ = require('lodash');


var htmlTypes = {
    file: { htmlType: 'file' },
    input: { htmlType: 'input' },
    password: { htmlType: 'password' },
    confirm: { htmlType: 'checkbox' },
    list: { htmlType: 'select', optType: 'option' },
    rawlist: { htmlType: 'div', optType: 'radio' },
    expand: { htmlType: 'div', optType: 'radio' },
    checkbox: { htmlType: 'div', optType: 'checkbox' }
};

function convertToHtml(originalQuestion) {
    if (originalQuestion.type in htmlTypes) {
        return _.merge(originalQuestion, htmlTypes[originalQuestion.type]);
    }
}


module.exports = {
    convertToHtml: convertToHtml
};

