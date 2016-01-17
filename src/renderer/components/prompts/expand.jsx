import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui';
import PromptMixin from './prompt-mixin';
import Container from '../prompt-form/container';
import Label from '../prompt-form/label';
import styles from '../../styles/components/prompts/list';

export default React.createClass({
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
