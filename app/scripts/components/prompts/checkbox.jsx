'use strict';

var React = require('react');

var InputMixin = require('./input.jsx');


var CheckboxPrompt = React.createClass({

  mixins: [InputMixin],

  getInitialState: function () {
    return {
      answer: this.prop.defaultAnswer
    };
  },

  _onChange: function (event) {
    this.setState({
      answer: event.target.checked
    });
  },

  render: function () {
    return (
      <p>
        <label>{this.prop.message}</label>
        <input
          type="checkbox"
          name={this.prop.name}
          checked={this.state.answer}
          onChange={this._onChange} />
      </p>
    );
  }

});


module.exports = CheckboxPrompt;

