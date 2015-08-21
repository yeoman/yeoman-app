import React, { PropTypes } from 'react';
import {
  Paper,
  FloatingActionButton
} from 'material-ui';

import classSet from 'classnames';

import PromptFormActions from '../actions/prompt-form-actions';
import CheckboxPrompt from './prompts/checkbox.jsx';
import ConfirmPrompt from './prompts/confirm.jsx';
import ExpandPrompt from './prompts/expand.jsx';
import FolderPrompt from './prompts/folder.jsx';
import InputPrompt from './prompts/input.jsx';
import ListPrompt from './prompts/list.jsx';

export default PromptForm = React.createClass({
  displayName: 'PromptForm',

  propTypes: {
    generator: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.object),
    selectedFolder: PropTypes.string,

    selectFolder: PropTypes.func,
    submitSelectedFolder: PropTypes.func,
    submitForm: PropTypes.func
  },

  getInitialState: function () {
    return {
      visibility: true
    };
  },

  getDefaultProps: function () {
    return {
      questions: []
    };
  },

  _onClick: function (event) {
    const {
      type,
      generator,
      questions,
      selectedFolder,
      submitSelectedFolder,
      submitForm
    } = this.props;

    const refs = this.refs;
    let answers = questions.reduce((ans, question) => {
      if (type === 'cwd') {
        ans[question.name] = selectedFolder;
      } else {
        ans[question.name] = refs[question.name].state.answer;
      }
      return ans;
    }, {});

    const action = type === 'cwd' ?
      submitSelectedFolder :
      submitForm;

    action(
      generator.name,
      answers
    );
    event.preventDefault();
  },

  render: function () {
    const { questions } = this.props;

    if (questions.length === 0) {
      return null;
    }

    // Builds required prompts from active questions
    var prompts = questions.map(this._renderQuestion);
    var classes = classSet('prompt', {
      'show': this.state.visibility
    });

    var doneButtonStyle = {
      position: 'absolute',
      top: 122,
      right: 20
    };

    return (
      <Paper className={classes}>
        <form>
          <div>{prompts}</div>
          <FloatingActionButton
            style={doneButtonStyle}
            iconClassName="muidocs-icon-action-done"
            onClick={this._onClick} />
        </form>
      </Paper>
    );
  },

  _renderQuestion(question) {
    const {
      generator: { color }
    } = this.props;

    if (!question.type) {
      question.type = 'input';
    }

    switch (question.type) {
      case 'string':
      case 'input':
      case 'password':
        return (
          <InputPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            type={question.type}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />
        );
      case 'confirm':
        return (
          <ConfirmPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />
        );
      case 'folder':
        return (
          <FolderPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
            selectedFolder={this.props.selectedFolder}
            selectFolder={this.props.selectFolder}
          />
        );
      case 'list':
        return (
          <ListPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default || question.choices[0].value}
            color={color}
          />
        );
      case 'expand':
        return (
          <ExpandPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default || question.choices[0].value}
            color={color}
          />
        );
      case 'checkbox':
        return (
          <CheckboxPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />
        );
      default:
        return <span key={question.name} />;
    }
  }
});


module.exports = PromptForm;

