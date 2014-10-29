(function (window) {

  'use strict';

  var document = window.document;

  if (!window.prompts) {
    throw { name: 'MISSING_MODULE', message: 'window.prompts module was not found' };
  }


  function create(question) {
    var p = window.prompts.input.create(question);
    var input = p.querySelector('input');
    var select = window.document.createElement('select');

    p.removeChild(input);
    input = null;

    if (question.default) {
      select.value = question.default;
    }

    question.choices.forEach(function (choice) {
      var opt = document.createElement('option');

      opt.textContent = choice.name;
      opt.value = choice.value;

      if (choice.value === question.default) {
        opt.selected = 'selected';
      }

      select.appendChild(opt);
    });

    p.appendChild(select);

    return p;
  }


  window.prompts.select = {
    create: create
  };

})(window);

