import React, { PropTypes } from 'react';
import {
  RaisedButton
} from 'material-ui';

import PromptMixin from './prompt-mixin';

export default React.createClass({
  displayName: 'FolderPrompt',

  propTypes: {
    selectedFolder: PropTypes.string,

    selectFolder: PropTypes.func
  },

  mixins: [PromptMixin],

  _onClick: function (e) {
    this.props.selectFolder();
    e.preventDefault();
  },

  render: function () {

    const raisedButtonStyle = {
      margin: '56px 24px 0px 24px'
    };

    const isEmpty = !!this.props.selectedFolder;

    return (
      <div className="select-folder-prompt fieldset">
        <label style={{ background: this.props.color }}>
          {this.props.message}
        </label>
        <div className="prompt-elements">
          <RaisedButton
            label="Select a folder"
            style={raisedButtonStyle}
            primary={!!isEmpty}
            onClick={this._onClick}
          />
          <span className="select-folder-prompt-display">
            {this.props.selectedFolder}
          </span>
        </div>
      </div>
    );
  }
});
