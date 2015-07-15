'use strict';

var React = require('react');
var classSet = require('classnames');

var CompatibilityWarning = require('./components/compatibility-warning.jsx');
var Grid = require('./components/grid.jsx');
var PromptForm = require('./components/prompt-form.jsx');
var GeneratorStore = require('./stores/generator-store');

var mui = require('material-ui');

var ThemeManager = mui.Styles.ThemeManager();

ThemeManager.setTheme(ThemeManager.types.LIGHT);

// Starts communication channel with atom-shell browser side
require('./utils/browser-utils');
// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;


var App = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getInitialState: function () {
    return {
      isLoading: 'none',
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
      .on('generator:install', this._onGeneratorStart);
    GeneratorStore.events
      .on('generator:done', this._onGeneratorDone);
  },

  componentWillUnmount: function () {
    GeneratorStore.events
      .removeListener('grid-item-selected', this._onItemSelected);
    GeneratorStore.events
      .removeListener('generator:prompt-questions', this._onQuestionPrompt);
    GeneratorStore.events
      .removeListener('generator:install', this._onGeneratorStart);
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

  _onGeneratorStart: function () {
    this.setState({
      isLoading: 'block',
      actualFormType: '',
      questions: []
    });
  },

  _onGeneratorDone: function () {
    this.setState({
      isLoading: 'none',
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

    var preloaderStyle = {
      width: 100,
      height: 100,
      position: 'absolute',
      left: '50%',
      top: '50%',
      marginLeft: -50,
      marginTop: -50,
      display: this.state.isLoading
    };

    return (
      <section>
        <div className="grid-wrap">
          <div id="generators-grid" className={gridClasses}>
            <Grid selectedGenerator={this.state.selectedGenerator} />
          </div>
        </div>
        <div className="content" style={promptContainerStyle}>
          <CompatibilityWarning active={this.state.selectedGenerator.isCompatible} />
          <img style={preloaderStyle} src="img/rings.svg" />
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

