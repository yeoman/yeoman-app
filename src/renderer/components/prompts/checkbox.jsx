import React from 'react';
import { Checkbox } from 'material-ui';
import PromptMixin from './prompt-mixin';
import Container from '../prompt-form/container';
import Label from '../prompt-form/label';
import styles from '../../styles/components/prompts/checkbox';


export default React.createClass({
  displayName: 'CheckboxPrompt',

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: []
    };
  },

  // Updates default state with any default choice
  componentDidMount: function () {
    this.setState({
      answer: this._getSelectedCheckboxes()
    });
  },

  _getSelectedCheckboxes: function () {
    return this.props.choices.filter(function (choice) {
      return this.refs[this._getRefName(choice)].state.checked;
    }, this).map(function (choice) {
      return this.refs[this._getRefName(choice)].props.value;
    }, this);
  },

  _getRefName: function (choice) {
    return 'checkbox-' + choice.name + '-' + choice.value;
  },

  _onChange: function () {
    this.setState({
      answer: this._getSelectedCheckboxes()
    });
  },

  _isChoiceChecked(choice) {
    return (
      choice.checked ||
      (
        Array.isArray(this.props.defaultAnswer) &&
        this.props.defaultAnswer.indexOf(choice.value) > -1
      )
    );
  },

  render: function () {

    const choices = this.props.choices.map((choice) => {

      const ref = this._getRefName(choice);
      const checked = this._isChoiceChecked(choice);

      return (
        <Checkbox
          type="checkbox"
          key={ref}
          ref={ref}
          name={choice.name}
          label={choice.name}
          value={choice.value}
          defaultChecked={checked}
          style={styles.item}
          labelStyle={styles.label}
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
          {choices}
        </div>
      </Container>
    );
  }
});
