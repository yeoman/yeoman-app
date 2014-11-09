'use strict';

var React = require('react');

var PromptMixin = require('./prompt-mixin');


var CheckboxPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onChange: function () {

    var refs = this.refs;

    this.setState({
      answer: Object.keys(refs).filter(function (item) {
        return refs[item].checked;
      }).map(function (item) {
        return refs[item].value;
      })
    });
  },

  render: function () {

    var choices = this.props.choices.map(function (choice, index) {

      var ref = 'radio-' + choice.name + '-' + choice.value;
      var def = this.props.defaultAnswer;
      var checked = def === index || def === choice.value;

      return (
        <span key={ref} className="list">
          <label htmlFor={choice.name}>{choice.name}</label>
          <input
            ref={ref}
            type="checkbox"
            name={choice.name}
            value={choice.value}
            defaultChecked={checked}
            onChange={this._onChange}
          />
        </span>
      );
    }, this);

    return (
      <p>
        <label>{this.props.message}</label>
        {choices}
      </p>
    );
  }

});


module.exports = CheckboxPrompt;

