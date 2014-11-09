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
          GeneratorStore.events.emit('grid-item-selected', action.name, questions);
        },
        'submit-selected-folder': function (action) {
          GeneratorStore.events.emit('submit-selected-folder', action.generatorName, action.answers);
        },
        'submit-form': function (action) {
          GeneratorStore.events.emit('submit-form', action.answers);
        }
      },

      BROWSER_ACTION: {
        'generators-data': function (action) {
          GeneratorStore.events.emit('generators-data', action.generators);
        },
        'question-prompt': function (action) {
          GeneratorStore.events.emit('question-prompt', action.questions);
        },
        'generator-done': function () {
          GeneratorStore.events.emit('generator-done');
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

