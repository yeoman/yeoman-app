'use strict';

var React = require('react');
var Input = require('material-ui/src/js/input.jsx');

var PromptMixin = require('./prompt-mixin');


var InputPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onChange: function () {
    this.setState({
      answer: this.refs[this.props.name].getValue()
    });
  },

  render: function () {
    return (
      <fieldset className="input-prompt">
        <label htmlFor={this.props.name} style={{ background: this.props.color }}>{this.props.message}</label>
        <Input
          ref={this.props.name}
          className="input-prompt-elem"
          type={this.props.type}
          name={this.props.name}
          value={this.state.answer}
          onChange={this._onChange}
        />
      </fieldset>
    );
  }

});


module.exports = InputPrompt;

