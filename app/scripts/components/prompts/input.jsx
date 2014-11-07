'use strict';

var React = require('react');


var InputMixin = {

  propTypes: {
    name: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    defaultAnswer: React.PropTypes.node,
    filter: React.PropTypes.func,
    choices: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps: function () {
    return {
      filter: function (value) { return value; },
      choices: []
    };
  }
};


module.exports = InputMixin;

