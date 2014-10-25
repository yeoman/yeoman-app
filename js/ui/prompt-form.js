(function (window) {

    'use strict';

    var document = window.document;
    var contentElem = document.getElementById('content');


    function createInputElement(question) {

        var p = document.createElement('p');
        var label = document.createElement('label');
        var input = document.createElement('input');

        label.textContent = question.message;
        input.name = question.name;
        input.type = question.type;

        question.extraAttrs.forEach(function (attr) {
            var key = Object.keys(attr)[0];
            input.setAttribute(key, attr[key]);
        });

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

        formElem.id = _id;

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

        formElem.addEventListener('submit', function onSubmitForm(e) {
            e.preventDefault();
            callback(this);
            return false;
        }.bind(formElem));
    }


    window.promptForm = {
        create: createForm
    };

})(window);

