// import { sample } from 'lodash';
import React, { PropTypes } from 'react';
import color from 'color';
import { Paper } from 'material-ui';
import classSet from 'classnames';
import { humanizeEventName as humanize } from 'underscore-plus';
import insight from '../utils/insight.js';
// import colors from '../utils/colors';

export default React.createClass({
  propTypes: {
    name: PropTypes.string,
    version: PropTypes.string,
    active: PropTypes.bool,
    isCompatible: PropTypes.bool,

    gridItemSelected: PropTypes.func
  },

  getInitialState: function () {
    return {
      color: '#666',
      zDepth: 1
    };
  },

  _onClick: function () {
    const { name, version, isCompatible, gridItemSelected } = this.props;

    const generatorName = name.replace('generator-', '');
    const actionName = `run-${generatorName}-${version}`;
    insight.sendEvent('generator', actionName, `Run ${generatorName} in version ${version}`);

    gridItemSelected({
      name,
      isCompatible,
      color: color(this.state.color).darken(0.2).hexString()
    });

    document.body.scrollTop = 0;
  },

  _onMouseOver: function () {
    this.setState({
      zDepth: 4
    });
  },

  _onMouseOut: function () {
    this.setState({
      zDepth: 1
    });
  },

  render: function () {

    const headerHeight = 300;

    // TODO: Investigate perf on this, checking clientHeight every render is expensive
    const contentHeight =
      window.document.getElementById('content').clientHeight + headerHeight;
    const filename = `img/${this.props.name}.png`;
    const generatorName = humanize(this.props.name.replace('generator-', '').replace('inair', 'InAiR').replace('app', 'App'));
    const classes = classSet('grid-item', {
      active: this.props.active
    });
    const style = {
      minHeight: (this.props.active ? contentHeight : 329) + 'px'
    };

    const headingStyle = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    };

    return (
      <Paper
        style={style}
        className={classes}
        zDepth={this.state.zDepth}
        onMouseOver={this._onMouseOver}
        onMouseOut={this._onMouseOut}
        onClick={this._onClick}>
        <div className="grid-bg" style={{ backgroundColor: this.state.color }} />
        <figure
          className="grid-img"
          style={{backgroundImage: `url(${filename})`}}>
        </figure>
        <h3 className="grid-item-heading" style={headingStyle}>{generatorName}</h3>
      </Paper>
    );
  }
});
