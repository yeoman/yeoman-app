'use strict';

var _ = require('lodash');
var React = require('react');
var color = require('color');
var mui = require('material-ui');
var classSet = require('classnames');
var insight = require('../utils/insight.js');

var GeneratorStore = require('../stores/generator-store');
var GridActions = require('../actions/grid-actions');
var colors = require('../utils/colors');

var Paper = mui.Paper;
var Card = mui.Card;
var CardTitle = mui.CardTitle;

var GridItem = React.createClass({

  getInitialState: function() {
    return {
      color: _.sample(colors),
      zDepth: 1
    };
  },

  _onClick: function () {
    var generatorName = this.props.name.replace('generator-', '');
    var generatorVersion = this.props.version;
    var actionName = 'run-' + generatorName + '-' + generatorVersion;
    insight.sendEvent('generator',  actionName, 'Run ' + generatorName + ' in version ' + generatorVersion);

    GridActions.gridItemSelected({
      name: this.props.name,
      color: color(this.state.color).darken(0.2).hexString()
    });
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

    var headerHeight = 300;
    var contentHeight =
      window.document.getElementById('content').clientHeight + headerHeight;
    var filename = 'img/' + this.props.name + '.png';
    var classes = classSet({
      'grid-item': true,
      'active': this.props.active
    });
    var style = {
      minHeight: (this.props.active ? contentHeight : 329) + 'px'
    };

    return (
      <Paper
        style={style}
        className={classes}
        zDepth={this.state.zDepth}
        onMouseOver={this._onMouseOver}
        onMouseOut={this._onMouseOut}
        onClick={this._onClick}>
        <div className="grid-bg" style={{ backgroundColor: this.state.color }}>
        </div>
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
    return {
      visible: false,
      officialGenerators: []
    };
  },

  componentDidMount: function () {
    GeneratorStore.events.on('generator:installed-generators', this._onGeneratorData);
    GeneratorStore.events.on('generator:done', this._onGeneratorDone);
  },

  componentWillUnmount: function () {
    GeneratorStore.events.removeListener('generator:done', this._onGeneratorDone);
  },

  _onGeneratorData: function (data) {
    insight.sendEvent('generator', 'total-installed-generators', 'Total installed generators', data.length);

    this.setState({
      officialGenerators: data,
      visible: true
    });
  },

  _onGeneratorDone: function () {
    insight.sendEvent('generator', 'done');
    // TODO: go back to grid state
  },

  render: function () {

    if (!this.state.visible) {
      return (
        <div/>
      )
    }

    var generatorList = this.state.officialGenerators;

    if (!generatorList.length) {
      return (
        <Card>
          <CardTitle title="No installed generators found!" subtitle="Please install at least one yeoman generator to continue."/>
        </Card>
      )
    }

    var items = generatorList.map(function (item) {
      return (
        <GridItem key={item.name} name={item.name} version={item.version} active={item.name === this.props.selectedGenerator.name} />
      );
    }.bind(this));

    return (
      <div className="grid">
        {items}
      </div>
    );
  }

});


module.exports = Grid;
