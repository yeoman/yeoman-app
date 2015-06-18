'use strict';


var AppDispatcher = require('../dispatcher/app-dispatcher');


var BrowserActions = {

  generatorsDataReceived: function (data) {
    AppDispatcher.handleBrowserAction({
      actionType: 'generator:installed-generators',
      generators: data
    });
  },

  questionPrompt: function (data) {
    AppDispatcher.handleBrowserAction({
      actionType: 'generator:prompt-questions',
      questions: data
    });
  },

  generatorDone: function () {
    AppDispatcher.handleBrowserAction({
      actionType: 'generator:done'
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
