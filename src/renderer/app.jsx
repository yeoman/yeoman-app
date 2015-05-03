'use strict';

var React = require('react');
var classSet = require('react/addons').addons.classSet;

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
      selectedGenerator: {}
    };
  },

  componentDidMount: function () {
    GeneratorStore.events
      .on('grid-item-selected', this._onItemSelected);
    GeneratorStore.events
      .on('generator:prompt-questions', this._onQuestionPrompt);
    GeneratorStore.events
      .on('generator:done', this._onGeneratorDone);
  },

  componentWillUnmount: function () {
    GeneratorStore.events
      .removeListener('grid-item-selected', this._onItemSelected);
    GeneratorStore.events
      .removeListener('generator:prompt-questions', this._onQuestionPrompt);
    GeneratorStore.events
      .removeListener('generator:done', this._onGeneratorDone);
  },

  _onItemSelected: function (generator, questions) {
    this.setState({
      actualFormType: 'cwd',
      questions: questions,
      selectedGenerator: generator
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
      selectedGenerator: {}
    });
  },

  render: function () {

    var gridClasses = classSet({
      'grid': true,
      'desactive': this.state.selectedGenerator.name
    });

    var promptContainerStyle = {
      display: this.state.selectedGenerator.name ? 'block' : 'none'
    };

    return (
      <section>
        <div className="grid-wrap">
          <div id="generators-grid" className={gridClasses}>
            <Grid selectedGenerator={this.state.selectedGenerator} />
          </div>
        </div>
        <div className="content" style={promptContainerStyle}>
          <PromptForm
            generator={this.state.selectedGenerator}
            questions={this.state.questions}
            type={this.state.actualFormType}
          />
        </div>
      </section>
    );
  }

});

React.render(<App />, document.getElementById('content'));


module.exports = App;

