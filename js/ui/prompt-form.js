(function (window) {

    'use strict';

    var questionsHelper = require('./js/lib/helpers/questions');

    var document = window.document;
    var contentElem = document.getElementById('content');
    var currentForm;


    function createInputElement(question) {

        var p = document.createElement('p');
        var label = document.createElement('label');
        var input;

        questionsHelper.convertToHtml(question);

        // ok, this grew out of hand, will need some refactor
        if (question.choices) {
            input = document.createElement(question.htmlType);
            input.name = question.type === 'list' ? question.name : null;

            question.choices.forEach(function (choice) {
                var elem = question.optType === 'option' ? 'option' : 'input';
                var opt = document.createElement(elem);
                var span = document.createElement('span');
                var br = document.createElement('br');

                input.appendChild(opt);

                if (question.optType === 'option') {
                    opt.textContent = choice.name;
                } else {
                    span.textContent = choice.name;
                    input.appendChild(span);
                    input.appendChild(br);
                }

                if (!input.name) {
                    opt.name = question.name;
                }

                if (choice.checked) {
                    opt.checked = true;
                }

                opt.label = choice.name;
                opt.value = choice.value;
                opt.type = question.optType;

            });

        } else {
            input = document.createElement('input');
            input.type = question.htmlType;
            input.name = question.name;

            if (question.type === 'confirm') {
                if (question.default) {
                    input.checked = true;
                }
            }
        }

        label.textContent = question.message;

        // Inject extra attributes on input tag
        if (question.extraAttrs) {
            question.extraAttrs.forEach(function (attr) {
                var key = Object.keys(attr)[0];
                input.setAttribute(key, attr[key]);
            });
        }

        p.appendChild(label);
        p.appendChild(input);

        return p;
    }

    function addActionButtons(formElem) {

        var div = document.createElement('div');
        var resetButton = document.createElement('input');
        var submitButton = document.createElement('input');

        resetButton.type = 'reset';
        resetButton.value = 'Reset';
        submitButton.type = 'submit';
        submitButton.value = 'Next';

        window.classie.addClass(div, 'action-bar');
        window.classie.addClass(resetButton, 'button');
        window.classie.addClass(submitButton, 'button');
        window.classie.addClass(submitButton, 'submit');

        div.appendChild(resetButton);
        div.appendChild(submitButton);

        formElem.appendChild(div);
    }

    function createForm(_id, questions, callback) {

        var formElem = document.createElement('form');

        if (currentForm) {
            removeForm(currentForm);
        }

        currentForm = formElem.id = _id;

        questions.forEach(function (item) {
            formElem.appendChild(
                createInputElement(item));
        });

        addActionButtons(formElem);
        contentElem.appendChild(formElem);

        formElem.getElemValue = function (elemName) {
            var elemsArr = [].slice.call(this.elements);
            return elemsArr.filter(function (item) {
                return item.name === elemName;
            }).shift().value;
        };

        formElem.getAnswers = function () {
            var elemsArr = [].slice.call(this.elements);
            return elemsArr.filter(function (item) {
                return item.name;
            }).map(function (item) {
                return { name: item.name, value: item.value };
            });
        };

        formElem.onSubmitForm = function (e) {
            e.preventDefault();
            callback(this);
            return false;
        };

        formElem.addEventListener('submit', formElem.onSubmitForm);
    }

    function removeForm(formName) {
        var form = document.getElementById(formName);
        form.removeEventListener('submit', form.onSubmitForm);
        contentElem.removeChild(form);
    }


    window.promptForm = {
        create: createForm
    };

})(window);

