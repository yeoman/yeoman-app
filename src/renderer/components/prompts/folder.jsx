'use strict';

var React = require('react');
var mui = require('material-ui');

var PromptMixin = require('./prompt-mixin');
var PromptFormActions = require('../../actions/prompt-form-actions');
var PromptStore = require('../../stores/prompt-store');

var RaisedButton = mui.RaisedButton;


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

    var raisedButtonStyle = {
      margin: '56px 24px 0px 24px'
    };

    return (
      <div className="select-folder-prompt fieldset">
        <label style={{ background: this.props.color }}>{this.props.message}</label>
        <div className="prompt-elements">
          <RaisedButton
            label="Select a folder"
            style={raisedButtonStyle}
            primary={this.state.isEmpty}
            onClick={this._onClick}
          />
          <span className="select-folder-prompt-display">{this.state.answer}</span>
        </div>
      </div>
    );
  }

});


module.exports = FolderPrompt;

