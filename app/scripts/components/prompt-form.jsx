'use strict';

var React = require('react');
var Paper = require('material-ui/src/js/paper.jsx');
var FloatingActionButton = require('material-ui/src/js/floating-action-button.jsx');
var classSet = require('react/addons').addons.classSet;

var PromptFormActions = require('../actions/prompt-form-actions');
var CheckboxPrompt = require('./prompts/checkbox.jsx');
var ConfirmPrompt = require('./prompts/confirm.jsx');
var FolderPrompt = require('./prompts/folder.jsx');
var InputPrompt = require('./prompts/input.jsx');
var ListPrompt = require('./prompts/list.jsx');


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

  _onSubmit: function (e) {

    var answers = {};
    var refs = this.refs; var callback = this.props.type === 'cwd' ?
      PromptFormActions.submitSelectedFolder :
      PromptFormActions.submitForm;

    this.props.questions.forEach(function mapAnswers(question) {
      answers[question.name] = refs[question.name].state.answer;
    });

    callback(
      this.props.generator.name,
      answers
    );
    e.preventDefault();
  },

  render: function () {

    var questions = this.props.questions;
    var color = this.props.generator.color;

    if (questions.length === 0) {
      return null;
    }

    // Factory to create new prompts
    function createPrompt(question) {

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

      var list = function () {
        return <ListPrompt
          key={question.name}
          ref={question.name}
          name={question.name}
          choices={question.choices}
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
        list: list,
        rawlist: list,
        expand: list,
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

    return (
      <Paper className={classes}>
        <form onSubmit={this._onSubmit}>
          <div>{prompts}</div>
          <FloatingActionButton className="submit-button" icon="action-done" />
        </form>
      </Paper>
    );
  }

});


module.exports = PromptForm;

