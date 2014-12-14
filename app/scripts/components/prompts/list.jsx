'use strict';

var React = require('react');
var RadioButton = require('material-ui/src/js/radio-button.jsx');

var PromptMixin = require('./prompt-mixin');


var ListPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _getRefName: function (name, value) {
    return 'list-item-' + name + '-' + value;
  },

  _onChange: function (event) {
    /*
    this.setState({
      answer: event.currentTarget.value
    });
    */
  },

  render: function () {

    var choices = this.props.choices.map(function (choice, index) {

      var def = this.props.defaultAnswer;
      var value = choice.value || choice;
      var name = choice.name || choice;
      var ref = this._getRefName(name, value);
      var checked = def === index || def === value;

      return (
        <RadioButton
          key={ref}
          ref={ref}
          name={this.props.name}
          value={value}
          label={name}
          checked={checked}
          onChange={this._onChange}
          className="list-prompt-list-item"
        />
      );
    }, this);

    return (
      <fieldset className="list-prompt">
        <label style={{ background: this.props.color }}>{this.props.message}</label>
        <div className="list-prompt-list">
          {choices}
        </div>
      </fieldset>
    );
  }

});


module.exports = ListPrompt;

