'use strict';

var _ = require('lodash');
var React = require('react');
var Paper = require('material-ui/src/js/paper.jsx');
var materialColors = require('material-colors/dist/colors.json');

var GeneratorStore = require('../stores/generator-store');
var GridActions = require('../actions/grid-actions');


// Stores an array with all material colors to be used on grid render
var colors = (function getAvailableColors(fromColors) {

  var arr = [];

  Object.keys(fromColors).forEach(function (key) {
    Object.keys(fromColors[key]).forEach(function (colorKey) {
      arr.push(fromColors[key][colorKey]);
    });
  });

  return arr;
})(materialColors);


var GridItem = React.createClass({

  getInitialState: function() {
    return {
      color: _.sample(colors),
      zDepth: 1
    };
  },

  _onClick: function () {
    GridActions.gridItemSelected(this.props.name);
  },

  _onMouseOver: function() {
    this.setState({
      zDepth: 4
    });
  },

  _onMouseOut: function() {
    this.setState({
      zDepth: 1
    });
  },

  render: function () {

    var filename = 'img/' + this.props.name + '.png';

    return (
      <Paper
        className="grid-item"
        zDepth={this.state.zDepth}
        onMouseOver={this._onMouseOver}
        onMouseOut={this._onMouseOut}
        onClick={this._onClick}>
        <div className="grid-bg" style={{ backgroundColor: this.state.color }}></div>
        <figure
          className="grid-img"
          style={{backgroundImage: 'url(' + filename + ')'}}>
        </figure>
        <h3 className="grid-item-heading">{this.props.name}</h3>
      </Paper>
    );
  }

});


var Grid = React.createClass({

  getInitialState: function () {
    return { officialGenerators: [] };
  },

  componentDidMount: function () {
    GeneratorStore.events.on('generators-data', this._onGeneratorData);
    GeneratorStore.events.on('generator-done', this._onGeneratorDone);
  },

  componentWillUnmount: function () {
    GeneratorStore.events.removeListener('generator-done', this._onGeneratorDone);
  },

  _onGeneratorData: function (data) {
    this.setState({
      officialGenerators: data
    });
  },

  _onGeneratorDone: function () {
    // TODO: go back to grid state
  },

  render: function () {

    var items = this.state.officialGenerators.map(function (item) {
      return (
        <GridItem key={item.name} name={item.name} />
      );
    });

    return (
      <div className="grid">
        {items}
      </div>
    );
  }

});


module.exports = Grid;

