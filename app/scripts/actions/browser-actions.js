'use strict';


var AppDispatcher = require('../dispatcher/app-dispatcher');


var BrowserActions = {

  generatorsDataReceived: function (data) {
    AppDispatcher.handleBrowserAction({
      actionType: 'generators-data',
      generators: data
    });
  }
};


module.exports = BrowserActions;

