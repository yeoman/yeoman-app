(function (window) {

  'use strict';

  var ipc = require('ipc');
  var document = window.document;

  if (!window.prompts) {
    throw { name: 'MISSING_MODULE', message: 'window.prompts module was not found' };
  }


  function create(question) {
    var p = window.prompts.input.create(question);
    var input = p.querySelector('input');
    var button = document.createElement('button');
    var span = document.createElement('span');
    var answer;

    p.removeChild(input);
    input = null;

    button.textContent = 'Select a folder';
    button.style.width = '120px';
    span.style.fontSize = '12px';
    window.classie.addClass(button, 'button');

    button.addEventListener('click', function (e) {
      e.preventDefault();
      ipc.send('prompts.folder.getFolder');
    });

    ipc.on('helpers.dialogs.selectDir', function (dir) {
      span.textContent = dir;
      answer = dir;
    });

    p.getAnswer = function () {
      return answer;
    };

    p.appendChild(button);
    p.appendChild(span);

    return p;
  }


  window.prompts.folder = {
    create: create
  };

})(window);

