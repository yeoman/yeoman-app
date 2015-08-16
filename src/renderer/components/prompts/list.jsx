'use strict';

var React = require('react');
var mui = require('material-ui');

var PromptMixin = require('./prompt-mixin');

var RadioButton = mui.RadioButton;
var RadioButtonGroup = mui.RadioButtonGroup;


var ListPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _getKeyName: function (name) {
    return 'list-item-' + name;
  },

  _onClick: function (value) {
    this.setState({
      answer: value
    });
  },

  render: function () {

    var choices = this.props.choices.map(function (choice, index) {

      var name = choice.name || choice;
      var key = this._getKeyName(name);

      return (
        <RadioButton
          key={key}
          name={this.props.name}
          value={choice.value}
          label={name}
          onClick={this._onClick.bind(this, choice.value)}
          className="list-prompt-list-item"
        />
      );
    }, this);

    return (
      <div className="list-prompt fieldset">
        <label style={{ background: this.props.color }}>
          {this.props.message}
        </label>
        <div className="list-prompt-list">
          <RadioButtonGroup name={this.props.name} defaultSelected={this.state.answer}>
            {choices}
          </RadioButtonGroup>
        </div>
      </div>
    );
  }

});


module.exports = ListPrompt;

