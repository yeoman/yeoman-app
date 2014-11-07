'use strict';

var React = require('react');

var InputMixin = require('./input.jsx');
var PromptFormActions = require('../../actions/prompt-form-actions');
var PromptStore = require('../../stores/prompt-store');


var FolderPrompt = React.createClass({

  mixins: [InputMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  componentDidMount: function () {
    PromptStore.events
      .on('folder-selected', this._onFolderSelected);
  },

  componentWillUnmount: function () {
    PromptStore.events
      .removeEventListener('folder-selected', this._onFolderSelected);
  },

  _onFolderSelected: function (cwd) {
    this.setState({
      answer: cwd
    });
  },

  _onClick: function (e) {
    PromptFormActions.selectFolder();
    e.preventDefault();
  },

  render: function () {
    return (
      <p>
        <label>{this.props.message}</label>
        <button
          className="select-folder"
          onClick={this._onClick}>Select a folder</button>
        <span className="selected-folder">{this.state.answer}</span>
      </p>
    );
  }

});


module.exports = FolderPrompt;

