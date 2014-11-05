'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');


var GridActions = {

  gridItemSelected: function(name) {
    AppDispatcher.handleViewAction({
      actionType: 'grid-item-selected',
      name: name
    });
  }
};


module.exports = GridActions;

