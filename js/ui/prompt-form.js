(function (window) {

    'use strict';

    var document = window.document;
    var contentElem = document.getElementById('content');
    var currentForm;


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
                window.prompts[item.promptType].create(item));
        });

        addActionButtons(formElem);
        contentElem.appendChild(formElem);

        formElem.getAnswers = function () {
            var result = {};
            var elemsArr = [].slice.call(this.children);

            elemsArr.filter(function (item) {
                return item.promptItem;
            }).forEach(function (item) {
                result[item.questionName] = item.getAnswer();
            });

            return result;
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

