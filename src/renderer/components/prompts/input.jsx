import React from 'react';
import { TextField } from 'material-ui';
import PromptMixin from './prompt-mixin';
import Container from '../prompt-form/container';
import Label from '../prompt-form/label';
import styles from '../../styles/components/prompts/input';

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
      <Container>
        <Label
          message={this.props.message}
          color={this.props.color}
        />
        <TextField
          style={styles.textfield}
          type={this.props.type}
          name={this.props.name}
          value={this.state.answer}
          onChange={this._onChange}
        />
      </Container>
    );
  }
});
