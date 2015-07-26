'use strict';

var React = require('react');
var mui = require('material-ui');

var PromptMixin = require('./prompt-mixin');

var TextField = mui.TextField;


var InputPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onChange: function (answer) {
    this.setState({
      answer: answer
    });
  },

  render: function () {
    return (
      <div className="input-prompt fieldset">
        <label htmlFor={this.props.name} style={{ background: this.props.color }}>{this.props.message}</label>
        <TextField
          className="input-prompt-elem"
          type={this.props.type}
          name={this.props.name}
          value={this.state.answer}
          onChange={this._onChange.bind(this, this.state.answer)}
        />
      </div>
    );
  }

});


module.exports = InputPrompt;

