'use strict';

var React = require('react');

var PromptMixin = require('./prompt-mixin');


var ConfirmPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onChange: function (event) {
    this.setState({
      answer: event.target.checked
    });
  },

  render: function () {
    return (
      <p>
        <label>{this.props.message}</label>
        <input
          type="checkbox"
          name={this.props.name}
          checked={this.state.answer}
          onChange={this._onChange}
        />
      </p>
    );
  }

});


module.exports = ConfirmPrompt;

