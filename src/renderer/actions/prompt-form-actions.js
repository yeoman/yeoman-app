'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');


var PromptFormActions = {

  submitForm: function (generatorName, answers) {
    AppDispatcher.handleViewAction({
      actionType: 'submit-form',
      answers: answers
    });
  },

  selectFolder: function () {
    AppDispatcher.handleViewAction({
      actionType: 'select-folder'
    });
  },

  submitSelectedFolder: function (generatorName, answers) {
    AppDispatcher.handleViewAction({
      actionType: 'submit-selected-folder',
      generatorName: generatorName,
      answers: answers
    });
  }
};


module.exports = PromptFormActions;

