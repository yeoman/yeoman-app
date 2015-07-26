'use strict';

var React = require('react');
var mui = require('material-ui');

var PromptMixin = require('./prompt-mixin');

var RadioButton = mui.RadioButton;


var ExpandPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _getKeyName: function (name) {
    return 'expand-item-' + name;
  },

  _onClick: function (answer) {
    this.setState({
      answer: answer
    });
  },

  render: function () {

    console.log('expand.render');
    console.log(this.props.defaultAnswer);
    console.log(this.state.answer);

    var choices = this.props.choices.map(function (choice) {

      var key = this._getKeyName(choice.name);

      return (
        <RadioButton
          key={key}
          name={this.props.name}
          value={choice.value}
          label={choice.name}
          onClick={this._onClick.bind(this, choice.value)}
          defaultChecked={choice.value && this.state.answer === choice.value}
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
          {choices}
        </div>
      </div>
    );
  }

});


module.exports = ExpandPrompt;

