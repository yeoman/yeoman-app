import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui';
import PromptMixin from './prompt-mixin';
import Container from '../prompt-form/container';
import Label from '../prompt-form/label';
import styles from '../../styles/components/prompts/list';

export default React.createClass({
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

    const choices = this.props.choices.map(choice => {

      const name = choice.name || choice;
      const key = this._getKeyName(name);

      return (
        <RadioButton
          key={key}
          name={this.props.name}
          value={choice.value}
          label={name}
          onClick={() => this._onClick(choice.value)}
          style={styles.listItem}
        />
      );
    });

    return (
      <Container>
        <Label
          message={this.props.message}
          color={this.props.color}
        />
        <div style={styles.list}>
          <RadioButtonGroup name={this.props.name} defaultSelected={this.state.answer}>
            {choices}
          </RadioButtonGroup>
        </div>
      </Container>
    );
  }
});
