import { sample } from 'lodash';
import React, { PropTypes } from 'react';
import color from 'color';
import { Paper } from 'material-ui';
import { humanizeEventName as humanize } from 'underscore-plus';
import insight from '../utils/insight.js';
import colors from '../utils/colors';
import styles from '../styles/components/grid-item';
import GetComponentStyle from './mixins/get-component-style';

function getFormattedName(name) {
  return humanize(name.replace('generator-', ''));
}

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
      color: sample(colors),
      zDepth: 1
    };
  },

  mixins: [
    GetComponentStyle
  ],

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
    const getStyle = this.getComponentStyle(this.props.active);

    // TODO: Investigate perf on this, checking clientHeight every render is expensive
    const contentHeight =
      window.document.getElementById('content').clientHeight + headerHeight;
    const generatorName = getFormattedName(this.props.name);
    let gridItemStyle = getStyle(
      styles.gridItem,
      Object.assign(
        {}, styles.gridItemActive,
        { minHeight: contentHeight }
      )
    );
    const gridItemImgStyle = getStyle(
      Object.assign({}, styles.img,
        { backgroundImage: `url(img/${this.props.name}.png)` }
      ),
      styles.imgActive
    );
    const gridItemBgStyle = getStyle(
      Object.assign({}, styles.bg,
        { backgroundColor: this.state.color }
      ),
      styles.bgActive
    );
    const gridItemH3Style = getStyle(
      styles.h3,
      styles.h3Active
    );

    // disables visual grid items when a generator is open
    if (!this.props.enabled) {
      gridItemStyle = Object.assign({}, gridItemStyle,
        { pointerEvents: 'none', cursor: 'default' }
      );
    }

    return (
      <Paper
        style={gridItemStyle}
        zDepth={this.state.zDepth}
        onMouseOver={this._onMouseOver}
        onMouseOut={this._onMouseOut}
        onClick={this._onClick}>
        <div style={gridItemBgStyle} />
        <figure style={gridItemImgStyle} />
        <h3 style={gridItemH3Style}>{generatorName}</h3>
      </Paper>
    );
  }
});
