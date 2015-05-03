'use strict';

var React = require('react');
var Checkbox = require('material-ui/src/js/checkbox.jsx');

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
    return (
      <div className="checkbox-prompt-item">
        <label htmlFor={this.props.name}>{this.props.name}</label>
        <Checkbox
          type="checkbox"
          ref={this._getRefName()}
          name={this.props.name}
          value={this.props.value}
          checked={this.state.checked}
          onChange={this._onChange}
        />
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
      <fieldset className="checkbox-prompt">
        <label style={{ background: this.props.color }}>{this.props.message}</label>
        <div className="checkbox-prompt-list">
          {choices}
        </div>
      </fieldset>
    );
  }

});


module.exports = CheckboxPrompt;

