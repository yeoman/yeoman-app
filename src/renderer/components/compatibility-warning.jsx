import React, { PropTypes } from 'react';
import { Snackbar } from 'material-ui';

export default React.createClass({
  displayName: 'CompatibilityWarning',

  propTypes: {
    active: PropTypes.bool,
    linkClicked: PropTypes.func
  },

  render: function () {
    const alertStyle = {
      display: this.props.active ? 'none' : 'block',
      visibility: this.props.active ? 'hidden' : 'visible',
      opacity: this.props.active ? 0 : 1,
      height: 'auto',
      lineHeight: '20px',
      paddingTop: 10,
      fontFamily: 'Roboto' //TODO: this should be fixed on material-ui
    };

    return (
      <Snackbar
        style={alertStyle}
        openOnMount={true}
        message="COMPATIBILITY WARNING: This generator does not meet the minimum requirements to be used with the Yeoman App"
        action="Click here to learn more about it"
        onActionTouchTap={this.props.linkClicked}
      />
    );
  }

});
