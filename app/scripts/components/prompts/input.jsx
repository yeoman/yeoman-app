'use strict';

var React = require('react');

var PromptMixin = require('./prompt-mixin');


var InputPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onChange: function (event) {
    this.setState({
      answer: event.target.value
    });
  },

  render: function () {
    return (
      <p>
        <label htmlFor={this.props.name}>{this.props.message}</label>
        <input
          type={this.props.type}
          name={this.props.name}
          value={this.state.answer}
          onChange={this._onChange}
        />
      </p>
    );
  }

});


module.exports = InputPrompt;

