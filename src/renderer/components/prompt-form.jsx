'use strict';

var React = require('react');
var mui = require('material-ui');

var classSet = require('classnames');

var PromptFormActions = require('../actions/prompt-form-actions');
var CheckboxPrompt = require('./prompts/checkbox.jsx');
var ConfirmPrompt = require('./prompts/confirm.jsx');
var ExpandPrompt = require('./prompts/expand.jsx');
var FolderPrompt = require('./prompts/folder.jsx');
var InputPrompt = require('./prompts/input.jsx');
var ListPrompt = require('./prompts/list.jsx');

var Paper = mui.Paper;
var FloatingActionButton = mui.FloatingActionButton;


var PromptForm = React.createClass({

  propTypes: {
    generator: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    questions: React.PropTypes.arrayOf(React.PropTypes.object)
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

    var answers = {};
    var refs = this.refs;
    var action = this.props.type === 'cwd' ?
      PromptFormActions.submitSelectedFolder :
      PromptFormActions.submitForm;

    this.props.questions.forEach(function mapAnswers(question) {
      answers[question.name] = refs[question.name].state.answer;
    });

    action(
      this.props.generator.name,
      answers
    );
    event.preventDefault();
  },

  render: function () {

    var questions = this.props.questions;
    var color = this.props.generator.color;

    if (questions.length === 0) {
      return null;
    }

    // Factory to create new prompts
    function createPrompt(question) {

      if (!question.type) {
        question.type = 'input';
      }

      var input = function () {
        return <InputPrompt
          key={question.name}
          ref={question.name}
          name={question.name}
          type={question.type}
          message={question.message}
          defaultAnswer={question.default}
          color={color}
        />;
      };

      var promptsByType = {
        input: input,
        password: input,
        confirm: function createConfirm() {
          return <ConfirmPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />;
        },
        folder: function createFolder() {
          return <FolderPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />;
        },
        list: function (defaultValue) {
          return <ListPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default || question.choices[0].value}
            color={color}
          />;
        },
        expand: function createExpand() {
          console.log('createExpand');
          console.log(question);
          return <ExpandPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default || question.choices[0].value}
            color={color}
          />;
        },
        checkbox: function createCheckbox() {
          return <CheckboxPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />;
        }
      };

      return promptsByType[question.type]();
    }

    // Builds required prompts from active questions
    var prompts = questions.map(createPrompt);
    var classes = classSet({
      'prompt': true,
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
          <FloatingActionButton style={doneButtonStyle} iconClassName="muidocs-icon-action-done" onClick={this._onClick} />
        </form>
      </Paper>
    );
  }

});


module.exports = PromptForm;

