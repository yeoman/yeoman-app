'use strict';

var React = require('react');

var GeneratorStore = require('../stores/generator-store');


var GridItem = React.createClass({

  render: function () {

    var filename = 'img/' + this.props.name + '.png';

    return (
      <figure>
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
    GeneratorStore.on('generator-data', this._onGeneratorData);
  },

  componentWillUnmount: function () {
    GeneratorStore.removeEventListener('generator-data', this._onGeneratorData);
  },

  _onGeneratorData: function (data) {
    this.setState({
      officialGenerators: data
    });
  },

  render: function () {

    var items = this.state.officialGenerators.map(function (item) {
      return (
        <GridItem key={item.name} name={item.name} />
      );
    });

    if (items.length) {
      new grid3D(document.getElementById('grid3d'));
    }

    return (
      <div className="grid">
        {items}
      </div>
    );
  }

});


module.exports = Grid;

