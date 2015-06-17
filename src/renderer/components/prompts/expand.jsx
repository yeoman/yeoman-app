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

  _getRefName: function (name) {
    return 'expand-item-' + name;
  },

  _onClick: function (event) {
    // Currently looking up on elems using query selector because material-ui
    // doesn't provide a better api for accessing value of RadioButton elem
    this.setState({
      answer: event.currentTarget.querySelector('input[type=radio]').value
    });
  },

  render: function () {

    console.log('expand.render');
    console.log(this.props.defaultAnswer);
    console.log(this.state.answer);

    var choices = this.props.choices.map(function (choice) {

      var ref = this._getRefName(choice.name);

      return (
        <RadioButton
          key={ref}
          ref={ref}
          name={this.props.name}
          value={choice.value}
          label={choice.name}
          onClick={this._onClick}
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

