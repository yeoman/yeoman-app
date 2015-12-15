import React, { PropTypes } from 'react';
import { Snackbar } from 'material-ui';

export default React.createClass({
  displayName: 'CompatibilityWarning',

  propTypes: {
    active: PropTypes.bool,
    linkClicked: PropTypes.func
  },

  // wrap the active props around the Snackbar api
  componentDidUpdate: function () {
    this.refs['compatibility-warning-snackbar'][
      (this.props.active === false) ? 'show' : 'dismiss'
    ]();
  },

  render: function () {
    const showWarn = this.props.active === false;
    const alertStyle = {
      display: showWarn ? 'block' : 'none',
      visibility: showWarn ? 'visible' : 'hidden',
      opacity: showWarn ? 1 : 0,
      height: 'auto',
      lineHeight: '20px',
      paddingTop: 10,
      fontFamily: 'Roboto' //TODO: this should be fixed on material-ui
    };

    return (
      <Snackbar
        ref="compatibility-warning-snackbar"
        bodyStyle={alertStyle}
        message="COMPATIBILITY WARNING: This generator does not meet the minimum requirements to be used with the Yeoman App"
        action="Click here to learn more about it"
        onActionTouchTap={this.props.linkClicked}
      />
    );
  }

});
