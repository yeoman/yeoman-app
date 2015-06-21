'use strict';

var React = require('react');
var mui = require('material-ui');

var Checkbox = mui.Checkbox;

var PromptMixin = require('./prompt-mixin');


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
        <Checkbox
          type="checkbox"
          key={ref}
          ref={ref}
          name={choice.name}
          label={choice.name}
          value={choice.value}
          defaultChecked={checked}
          style={{ marginBottom: 10 }}
        />
      );

    }, this);

    return (
      <div className="checkbox-prompt fieldset">
        <label style={{ background: this.props.color }}>{this.props.message}</label>
        <div className="checkbox-prompt-list" style={{ margin: 20 }}>
          {choices}
        </div>
      </div>
    );
  }

});


module.exports = CheckboxPrompt;

