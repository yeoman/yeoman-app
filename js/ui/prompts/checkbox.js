(function (window) {

    'use strict';

    if (!window.prompts) {
        throw { name: 'MISSING_MODULE', message: 'window.prompts module was not found' };
    }


    function create(question) {
        var p = window.prompts.input.create(question);
        var input = p.querySelector('input');

        if (question.default) {
            input.checked = 'checked';
        }

        p.getAnswer = function () {
            return input.checked;
        };

        return p;
    }


    window.prompts.checkbox = {
        create: create
    };

})(window);

