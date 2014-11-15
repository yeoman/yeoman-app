'use strict';

var React = require('react');

var GeneratorStore = require('../stores/generator-store');
var GridActions = require('../actions/grid-actions');


var GridItem = React.createClass({

  _onClick: function () {
    GridActions.gridItemSelected(this.props.name);
  },

  render: function () {

    var filename = 'img/' + this.props.name + '.png';

    return (
      <figure onClick={this._onClick}>
        <img src={filename} />
      </figure>
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

