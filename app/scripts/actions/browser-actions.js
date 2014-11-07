'use strict';


var AppDispatcher = require('../dispatcher/app-dispatcher');


var BrowserActions = {

  generatorsDataReceived: function (data) {
    AppDispatcher.handleBrowserAction({
      actionType: 'generators-data',
      generators: data
    });
  },

  folderSelected: function (data) {
    AppDispatcher.handleBrowserAction({
      actionType: 'folder-selected',
      cwd: data
    });
  }
};


module.exports = BrowserActions;

