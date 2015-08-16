import React from 'react';
import {
  RadioButton,
  RadioButtonGroup
} from 'material-ui';

import PromptMixin from './prompt-mixin';

export default ListPrompt = React.createClass({
  displayName: 'ListPrompt',

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _getKeyName: function (name) {
    return `list-item-${name}`;
  },

  _onClick: function (value) {
    this.setState({
      answer: value
    });
  },

  render: function () {

    const choices = this.props.choices.map((choice, index) => {

      const name = choice.name || choice;
      const key = this._getKeyName(name);

      return (
        <RadioButton
          key={key}
          name={this.props.name}
          value={choice.value}
          label={name}
          onClick={() => this._onClick(choice.value)}
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
