'use strict';

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var AppDispatcher = require('../dispatcher/app-dispatcher');


var GeneratorStore = merge(EventEmitter.prototype, {

  dispatcherIndex: AppDispatcher.register(function (payload) {

    var handlers = {

      VIEW_ACTION: {
        'grid-item-selected': function (action) {
          GeneratorStore.emit('grid-item-selected');
        }
      },

      BROWSER_ACTION: {
        'generators-data': function (action) {
          GeneratorStore.emit('generator-data', action.generators);
        }
      }
    };

    if (payload.action.actionType in handlers[payload.source]) {
      handlers[payload.source][payload.action.actionType](payload.action);
    }

    return true;
  })

});


module.exports = GeneratorStore;

