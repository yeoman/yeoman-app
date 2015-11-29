import React from 'react';
import {
  TextField
} from 'material-ui';

import PromptMixin from './prompt-mixin';

export default React.createClass({
  displayName: 'InputPrompt',

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onChange: function (e) {
    this.setState({
      answer: e.target.value
    });
  },

  render: function () {
    return (
      <div className="input-prompt fieldset">
        <label htmlFor={this.props.name} style={{ background: this.props.color }}>{this.props.message}</label>
        <TextField
          className="input-prompt-elem"
          type={this.props.type}
          name={this.props.name}
          value={this.state.answer}
          onChange={this._onChange}
        />
      </div>
    );
  }
});
