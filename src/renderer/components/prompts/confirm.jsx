import React from 'react';
import { RaisedButton } from 'material-ui';

import classSet from 'classnames';

import PromptMixin from './prompt-mixin';

export default React.createClass({
  displayName: 'ConfirmPrompt',

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onClickNo: function (event) {
    this.setState({
      answer: false
    });
    event.preventDefault();
  },

  _onClickYes: function (event) {
    this.setState({
      answer: true
    });
    event.preventDefault();
  },

  render: function () {

    const classesButtonNo = classSet(
      'confirm-button',
      'button-no', {
        active: !this.state.answer
      }
    );

    const classesButtonYes = classSet(
      'confirm-button',
      'button-yes', {
        active: this.state.answer
      }
    );

    return (
      <div className="confirm-prompt fieldset">
        <label style={{ background: this.props.color }}>{this.props.message}</label>
        <div className="confirm-options">
          <RaisedButton
            className={classesButtonNo}
            label="No"
            onClick={this._onClickNo}
          />
          <RaisedButton
            className={classesButtonYes}
            label="Yes"
            onClick={this._onClickYes}
          />
        </div>
      </div>
    );
  }
});
