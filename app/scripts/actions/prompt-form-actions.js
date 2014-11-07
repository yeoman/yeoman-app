'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');


var PromptFormActions = {

  submitForm: function (answers) {
    console.log(answers[0].answer);
    AppDispatcher.handleViewAction({
      actionType: 'submit-form',
      answers: answers
    });
  },

  selectFolder: function () {
    AppDispatcher.handleViewAction({
      actionType: 'select-folder'
    });
  }
};


module.exports = PromptFormActions;

