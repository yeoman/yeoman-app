'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');


var CompatibilityWarningActions = {

  linkClicked: function() {
    AppDispatcher.handleViewAction({
      actionType: 'compatibility-link-clicked'
    });
  }
};


module.exports = CompatibilityWarningActions;

