'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');


var PromptFormActions = {

  submitForm: function(name) {
    AppDispatcher.handleViewAction({
      actionType: 'grid-item-selected',
      name: name
    });
  }
};


module.exports = PromptFormActions;

