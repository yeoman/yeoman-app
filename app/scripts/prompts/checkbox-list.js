(function (window) {

  'use strict';

  var document = window.document;

  if (!window.prompts) {
    throw { name: 'MISSING_MODULE', message: 'window.prompts module was not found' };
  }


  function create(question) {
    var p = window.prompts.input.create(question);
    var input = p.querySelector('input');
    var div = window.document.createElement('div');

    p.removeChild(input);
    input = null;

    delete div.type;
    delete div.name;

    question.choices.forEach(function (choice) {
      var opt = document.createElement('input');
      var span = document.createElement('span');
      var br = document.createElement('br');

      opt.type = 'checkbox';
      opt.name = choice.name;
      opt.value = choice.value;

      span.textContent = choice.name;

      if (choice.checked) {
        opt.checked = 'checked';
      }

      div.appendChild(opt);
      div.appendChild(span);
      div.appendChild(br);
    });

    p.appendChild(div);

    p.getAnswer = function () {
      return [].slice.call(div.children)
        .filter(function (item) {
            return item.checked;
          }).map(function (item) {
            return item.value;
          });
    };

    return p;
  }


  window.prompts.checkboxList = {
    create: create
  };

})(window);

