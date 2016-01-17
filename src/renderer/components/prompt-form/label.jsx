import React from 'react';
import { label } from '../../styles/components/prompts';

export default React.createClass({
  propTypes: {
    color: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired
  },
  render() {
    var style = Object.assign({}, label,
      { background: this.props.color }
    );
    return (
      <label style={style}>
        {this.props.message}
      </label>
    );
  }
});

