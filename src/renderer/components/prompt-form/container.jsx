import React from 'react';
import styles from '../../styles/components/prompts';

export default React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },
  render() {
    return (
      <div style={styles.container}>{this.props.children}</div>
    );
  }
});

