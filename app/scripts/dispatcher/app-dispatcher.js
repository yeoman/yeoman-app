'use strict';

var Dispatcher = require('flux/lib/Dispatcher');


var AppDispatcher = new Dispatcher();

AppDispatcher.handleViewAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
};

AppDispatcher.handleBrowserAction = function(action) {
  this.dispatch({
    source: 'BROWSER_ACTION',
    action: action
  });
};


module.exports = AppDispatcher;

