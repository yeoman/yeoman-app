'use strict';

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/app-dispatcher');


var GeneratorStore = {

  events: new EventEmitter(),

  dispatcherIndex: AppDispatcher.register(function (payload) {

    var handlers = {

      VIEW_ACTION: {
        'grid-item-selected': function (action) {
          var questions = [{
            message: 'Please specify a folder to be used to generate the project',
            name: 'cwd',
            type: 'folder'
          }];
          GeneratorStore.events.emit('grid-item-selected', action.generator, questions);
        },
        'submit-selected-folder': function (action) {
          GeneratorStore.events.emit('submit-selected-folder', action.generatorName, action.answers);
        },
        'submit-form': function (action) {
          GeneratorStore.events.emit('submit-form', action.answers);
        }
      },

      BROWSER_ACTION: {
        'generator:data': function (action) {
          GeneratorStore.events.emit('generator:data', action.generators);
        },
        'generator:prompt-questions': function (action) {
          GeneratorStore.events.emit('generator:prompt-questions', action.questions);
        },
        'generator:done': function () {
          GeneratorStore.events.emit('generator:done');
        }
      }
    };

    if (AppDispatcher.hasHandler(payload, handlers)) {
      handlers[payload.source][payload.action.actionType](payload.action);
    }

    return true;
  })

};


module.exports = GeneratorStore;

