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

  _getRefName: function (name) {
    return 'list-item-' + name;
  },

  _onClick: function (event) {
    // Currently looking up on elems using query selector because material-ui
    // doesn't provide a better api for accessing value of RadioButton elem
    var value = event.currentTarget.querySelector('input[type=radio]').value;
    this.setState({
      answer: this.props.choices.findIndex(function (item) {
        var itemValue = item.value || item;
        return itemValue === value;
      }, null)
    });
  },

  render: function () {

    var choices = this.props.choices.map(function (choice, index) {

      var def = this.props.defaultAnswer;
      var name = choice.name || choice;
      var ref = this._getRefName(name);
      var checked = def === index || def === name;

      return (
        <RadioButton
          key={ref}
          ref={ref}
          name={this.props.name}
          value={name}
          label={name}
          checked={checked}
          onClick={this._onClick}
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

