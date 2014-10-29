(function (window) {

  'use strict';


  var getFolderPrompt = [{
    message: 'Please specify a folder to be used to generate the project',
    name: 'cwd',
    type: 'folder'
  }];

  var htmlTypes = {
    folder: {
      promptType: 'folder',
      htmlType: 'file'
    },
    input: {
      promptType: 'input',
      htmlType: 'text'
    },
    password: {
      promptType: 'input',
      htmlType: 'password'
    },
    confirm: {
      promptType: 'checkbox',
      htmlType: 'checkbox'
    },
    list: {
      promptType: 'select',
      htmlType: 'select',
      optType: 'option'
    },
    rawlist: {
      promptType: 'radioList',
      htmlType: 'div',
      optType: 'radio'
    },
    expand: {
      promptType: 'radioList',
      htmlType: 'div',
      optType: 'radio'
    },
    checkbox: {
      promptType: 'checkboxList',
      htmlType: 'div',
      optType: 'checkbox'
    }
  };

  function addHtmlData(questions) {

    return questions.map(function (originalQuestion) {

      var type = htmlTypes[originalQuestion.type];

      if (originalQuestion.type in htmlTypes) {

        Object.keys(type).forEach(function (prop) {
          originalQuestion[prop] = type[prop];
        });
      }

      return originalQuestion;
    });
  }


  window.helpersPrompts = {
    addHtmlData: addHtmlData,
    getFolderPrompt: getFolderPrompt
  };

})(window);
