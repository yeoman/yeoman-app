import React from 'react';
import {
  RadioButton,
  RadioButtonGroup
} from 'material-ui';

import PromptMixin from './prompt-mixin';

export default ExpandPrompt = React.createClass({
  displayName: 'ExpandPrompt',

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _getKeyName: function (name) {
    return `expand-item-${name}`;
  },

  _onClick: function (answer) {
    this.setState({
      answer: answer
    });
  },

  render: function () {
    const choices = this.props.choices.map((choice) => {
      const key = this._getKeyName(choice.name);

      return (
        <RadioButton
          key={key}
          name={this.props.name}
          value={choice.value}
          label={choice.name}
          onClick={this._onClick.bind(this, choice.value)}
          className="list-prompt-list-item"
        />
      );
    });

    return (
      <div className="list-prompt fieldset">
        <label style={{ background: this.props.color }}>
          {this.props.message}
        </label>
        <div className="list-prompt-list">
          <RadioButtonGroup name={this.props.name} defaultSelected={this.state.answer}>
            {choices}
          </RadioButtonGroup>
        </div>
      </div>
    );
  }
});
