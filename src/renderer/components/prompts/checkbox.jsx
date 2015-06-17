'use strict';

var React = require('react');
var mui = require('material-ui');

var Checkbox = mui.Checkbox;

var PromptMixin = require('./prompt-mixin');


var CheckboxPromptItem = React.createClass({

  getInitialState: function () {
    return {
      checked: this.props.defaultChecked
    };
  },

  _onChange: function (event) {
    this.setState({
      checked: this.refs[this._getRefName()].state.checked
    });

    this.props.onChange();
    event.preventDefault();
  },

  _getRefName: function () {
    return 'checkbox-item-' + this.props.name + '-' + this.props.value;
  },

  render: function () {
    var checkboxStyle = {
      width: 'auto'
    };

    return (
      <div className="checkbox-prompt-item">
        <Checkbox
          type="checkbox"
          ref={this._getRefName()}
          name={this.props.name}
          value={this.props.value}
          checked={this.state.checked}
          onChange={this._onChange}
          style={checkboxStyle}
        />
        <label htmlFor={this.props.name}>{this.props.name}</label>
      </div>
    );
  }
});


var CheckboxPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: []
    };
  },

  // Updates default state with any default choice
  componentDidMount: function () {
    this.setState({
      answer: this._getSelectedCheckboxes()
    });
  },

  _getSelectedCheckboxes: function () {
    return this.props.choices.filter(function (choice) {
      return this.refs[this._getRefName(choice)].state.checked;
    }, this).map(function (choice) {
      return this.refs[this._getRefName(choice)].props.value;
    }, this);
  },

  _getRefName: function (choice) {
    return 'checkbox-' + choice.name + '-' + choice.value;
  },

  _onChange: function () {
    this.setState({
      answer: this._getSelectedCheckboxes()
    });
  },

  render: function () {

    var choices = this.props.choices.map(function (choice) {

      var ref = this._getRefName(choice);
      var checked = choice.checked ||
        Array.isArray(this.props.defaultAnswer) &&
        this.props.defaultAnswer.indexOf(choice.value) > -1;

      return (
        <CheckboxPromptItem
          key={ref}
          ref={ref}
          name={choice.name}
          value={choice.value}
          defaultChecked={checked}
          onChange={this._onChange}
        />
      );

    }, this);

    return (
      <div className="checkbox-prompt fieldset">
        <label style={{ background: this.props.color }}>{this.props.message}</label>
        <div className="checkbox-prompt-list">
          {choices}
        </div>
      </div>
    );
  }

});


module.exports = CheckboxPrompt;

