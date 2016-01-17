import React from 'react';
import { container } from '../../styles/components/prompts';

export default React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },
  render() {
    return (
      <div style={container}>{this.props.children}</div>
    );
  }
});

