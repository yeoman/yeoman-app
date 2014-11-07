'use strict';

var React = require('react');

var PromptFormActions = require('../actions/prompt-form-actions');
var CheckboxPrompt = require('./prompts/checkbox.jsx');
var FolderPrompt = require('./prompts/folder.jsx');
var GeneratorStore = require('../stores/generator-store');


var PromptForm = React.createClass({

  getInitialState: function () {
    return {
      questions: [],
      visibility: 'hide'
    };
  },

  componentDidMount: function () {
    GeneratorStore.events
      .on('grid-item-selected', this._onItemSelected);
  },

  componentWillUnmount: function () {
    GeneratorStore.events
      .removeEventListener('grid-item-selected', this._onItemSelected);
  },

  _onItemSelected: function (questions) {
    this.setState({
      questions: questions,
      visibility: 'show'
    });
  },

  _onSubmit: function (e) {

    var refs = this.refs;

    function mapAnswers(question) {
      return {
        value: question.name,
        answer: refs[question.name].state.answer
      };
    }

    PromptFormActions.submitForm(
      this.state.questions.map(mapAnswers)
    );
    e.preventDefault();
  },

  render: function () {

    var questions = this.state.questions;

    if (this.state.questions.length === 0) {
      return null;
    }

    // Factory to create new prompts
    function createPrompt(question) {
      var promptsByType = {
        checkbox: function createCheckbox() {
          return <CheckboxPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default} />;
        },
        folder: function createFolder() {
          return <FolderPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default} />;
        }
      };
      return promptsByType[question.type]();
    }

    // Builds required prompts from active questions
    var prompts = questions.map(createPrompt);

    return (
      <form className={this.state.visibility} onSubmit={this._onSubmit}>
        <div>{prompts}</div>
        <div className="action-bar">
          <input className="button" type="reset" value="Reset" />
          <input className="button submit" type="submit" value="Next" />
        </div>
      </form>
    );
  }

});


module.exports = PromptForm;

