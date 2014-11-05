'use strict';

var React = require('react');

var Grid = require('./grid.jsx');
// Starts communication channel with atom-shell browser side
require('./utils/browser-utils');
// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;


var App = React.createClass({

  onGeneratorsData: function (data) {
    this.setState({
      officialGenerators: data
    });
  },

  componentDidMount: function () {
  },

  getInitialState: function () {
    return { officialGenerators: [] };
  },

  render: function () {
    return (
      <Grid items={this.state.officialGenerators} />
    );
  }

});

React.render(<App />, document.getElementById('generators-grid'));


module.exports = App;

