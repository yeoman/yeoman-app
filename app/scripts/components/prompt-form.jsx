'use strict';

var React = require('react');

var PromptFormActions = require('../actions/prompt-form-actions');
var GeneratorStore = require('../stores/generator-store');


var PromptForm = React.createClass({

  getInitialState: function () {
    return {
      visibility: 'hide'
    };
  },

  componentDidMount: function () {
    GeneratorStore.on('grid-item-selected', this._onItemSelected);
  },

  componentWillUnmount: function () {
    GeneratorStore.removeEventListener('grid-item-selected', this._onItemSelected);
  },

  _onItemSelected: function () {
    this.setState({
      visibility: 'show'
    });
  },

  _onSubmit: function (e) {
    PromptFormActions.submitForm();
    e.preventDefault();
  },

  render: function () {

    return (
      <form className={this.state.visibility} onSubmit={this._onSubmit}>
        <div className="action-bar">
          <input className="button" type="reset" value="Reset" />
          <input className="button submit" type="submit" value="Next" />
        </div>
      </form>
    );
  }

});


module.exports = PromptForm;

