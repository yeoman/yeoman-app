'use strict';

var React = require('react');
var RaisedButton = require('material-ui/src/js/raised-button.jsx');

var PromptMixin = require('./prompt-mixin');
var PromptFormActions = require('../../actions/prompt-form-actions');
var PromptStore = require('../../stores/prompt-store');


var FolderPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer,
      isEmpty: true
    };
  },

  componentDidMount: function () {
    PromptStore.events
      .on('folder-selected', this._onFolderSelected);
  },

  componentWillUnmount: function () {
    PromptStore.events
      .removeListener('folder-selected', this._onFolderSelected);
  },

  _onFolderSelected: function (cwd) {
    this.setState({
      answer: cwd,
      isEmpty: false
    });
  },

  _onClick: function (e) {
    PromptFormActions.selectFolder();
    e.preventDefault();
  },

  render: function () {
    return (
      <fieldset>
        <label style={{ background: this.props.color }}>{this.props.message}</label>
        <RaisedButton
          label="Select a folder"
          primary={this.state.isEmpty}
          className="select-folder"
          onClick={this._onClick}
        />
        <span className="selected-folder">{this.state.answer}</span>
      </fieldset>
    );
  }

});


module.exports = FolderPrompt;

