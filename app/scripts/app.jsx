'use strict';

var React = require('react');

var Grid = require('./components/grid.jsx');
var PromptForm = require('./components/prompt-form.jsx');
var GeneratorStore = require('./stores/generator-store');

// Starts communication channel with atom-shell browser side
require('./utils/browser-utils');
// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;


var App = React.createClass({

  getInitialState: function () {
    return {
      actualFormType: '',
      questions: [],
      selectedGeneratorName: ''
    };
  },

  componentDidMount: function () {
    GeneratorStore.events
      .on('grid-item-selected', this._onItemSelected);
    GeneratorStore.events
      .on('question-prompt', this._onQuestionPrompt);
    GeneratorStore.events
      .on('generator-done', this._onGeneratorDone);
  },

  componentWillUnmount: function () {
    GeneratorStore.events
      .removeListener('grid-item-selected', this._onItemSelected);
    GeneratorStore.events
      .removeListener('question-prompt', this._onQuestionPrompt);
    GeneratorStore.events
      .removeListener('generator-done', this._onGeneratorDone);
  },

  _onItemSelected: function (generatorName, questions) {
    this.setState({
      actualFormType: 'cwd',
      questions: questions,
      selectedGeneratorName: generatorName
    });
  },

  _onQuestionPrompt: function (questions) {
    this.setState({
      actualFormType: 'prompt',
      questions: questions
    });
  },

  _onGeneratorDone: function () {
    this.setState({
      actualFormType: '',
      questions: [],
      selectedGeneratorName: ''
    });
  },

  render: function () {
    return (
      <section>
        <div className="grid-wrap">
          <div id="generators-grid" className="grid">
            <Grid selectedGenerator={this.state.selectedGeneratorName} />
          </div>
        </div>
        <div className="content">
          <PromptForm
            generatorName={this.state.selectedGeneratorName}
            questions={this.state.questions}
            type={this.state.actualFormType}
          />
          <span className="loading"></span>
          <span className="icon close-content"></span>
        </div>
      </section>
    );
  }

});

React.render(<App />, document.getElementById('content'));


module.exports = App;

