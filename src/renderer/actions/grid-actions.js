'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');


var GridActions = {

  gridItemSelected: function(selectedGenerator) {
    AppDispatcher.handleViewAction({
      actionType: 'grid-item-selected',
      generator: selectedGenerator
    });
  }
};


module.exports = GridActions;

