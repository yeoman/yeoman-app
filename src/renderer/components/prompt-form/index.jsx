import React, { PropTypes } from 'react';
import { Paper, FloatingActionButton } from 'material-ui';
import promptFormStyles from '../../styles/components/prompt-form';
import GetComponentStyle from '../mixins/get-component-style';
import QuestionRenderer from './question-renderer-mixin.jsx';

export default React.createClass({
  displayName: 'PromptForm',

  mixins: [
    GetComponentStyle,
    QuestionRenderer
  ],

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
    const prompts = questions.map(this.renderQuestion);

    const getStyle = this.getComponentStyle(this.state.visibility);
    const promptFormStyle = getStyle(
      {
        position: 'absolute',
        top: promptFormStyles.margin,
        left: '50%',
        width: promptFormStyles.width,
        minHeight: promptFormStyles.height,
        backgroundColor: '#FFF',
        marginLeft: -(promptFormStyles.width / 2),
        display: 'none'
      },
      {
        display: 'block'
      }
    );
    const promptFormFormStyle = {
      width: '100%',
      height: '100%'
    };
    const doneButtonStyle = {
      position: 'absolute',
      top: 122,
      right: 20
    };

    return (
      <Paper style={promptFormStyle}>
        <form style={promptFormFormStyle}>
          <div>{prompts}</div>
          <FloatingActionButton
            style={doneButtonStyle}
            iconClassName="muidocs-icon-action-done"
            onClick={this._onClick} />
        </form>
      </Paper>
    );
  }

});
