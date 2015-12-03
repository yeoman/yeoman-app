import React, { PropTypes } from 'react';
import { Card, CardTitle } from 'material-ui';
import GridItem from './grid-item.jsx';

export default React.createClass({
  propTypes: {
    selectedGenerator: PropTypes.object,
    generators: PropTypes.array,
    gridItemSelected: PropTypes.func
  },

  render: function () {
    const { generators } = this.props;

    if (!generators) {
      return <div />;
    }

    if (!generators.length) {
      return (
        <Card>
          <CardTitle
            title="No installed generators found!"
            subtitle="Please install at least one InAiR generator to continue."/>
        </Card>
      );
    }

    const items = generators.map((item) => {
      return (
        <GridItem
          key={item.name}
          name={item.name}
          version={item.version}
          active={item.name === this.props.selectedGenerator.name}
          isCompatible={item.isCompatible}
          gridItemSelected={this.props.gridItemSelected} />
      );
    });

    return (
      <div className="grid">
        {items}
      </div>
    );
  }
});
