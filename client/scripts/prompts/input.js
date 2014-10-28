(function (window) {

    'use strict';


    function create(question) {
        var p = document.createElement('p');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var filterFn = question.filter ?
            question.filter :
            function (value) { return value; };

        input.type = question.htmlType;
        input.name = question.name;

        label.textContent = question.message;

        p.questionName = question.name;
        p.promptItem = true;
        p.appendChild(label);
        p.appendChild(input);

        p.getAnswer = function () {
            return filterFn(input.value);
        };

        return p;
    }


    if (!window.prompts) {
        window.prompts = {};
    }

    window.prompts.input = {
        create: create
    };

})(window);

