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
      answer: this.refs[this._getRefName()].getValue()
    });
  },

  _getRefName: function () {
    return 'input-' + this.props.name + '-' + this.props.value;
  },

  render: function () {
    return (
      <fieldset className="input-prompt">
        <label htmlFor={this.props.name} style={{ background: this.props.color }}>{this.props.message}</label>
        <Input
          ref={this._getRefName()}
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

