'use strict';

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/app-dispatcher');


var PromptStore = {

  events: new EventEmitter(),

  dispatcherIndex: AppDispatcher.register(function (payload) {

    var handlers = {

      VIEW_ACTION: {
        'select-folder': function () {
          PromptStore.events.emit('select-folder');
        }
      },

      BROWSER_ACTION: {
        'folder-selected': function (action) {
          PromptStore.events.emit('folder-selected', action.cwd);
        }
      }
    };

    if (AppDispatcher.hasHandler(payload, handlers)) {
      handlers[payload.source][payload.action.actionType](payload.action);
    }

    return true;
  })

};


module.exports = PromptStore;

