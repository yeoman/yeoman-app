'use strict';

var _ = require('lodash');


var htmlTypes = {
    confirm: {
        type: 'checkbox',
        extraAttrs: [
            { checked: true }
        ]
    }
};

function convertToHtmlType(originalQuestion) {
    if (originalQuestion.type in htmlTypes) {
        return _.merge(originalQuestion, htmlTypes[originalQuestion.type]);
    }
}


module.exports = {
    convertToHtmlType: convertToHtmlType
};

