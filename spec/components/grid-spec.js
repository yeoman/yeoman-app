import sinon from 'sinon';

import createComponent from '../helpers/createComponent.js';
import Grid from '../../src/renderer/components/grid.jsx';
import generatorsList from '../fixtures/generators-list.js';

describe('Grid', function () {
  let tree;
  let renderOutput;

  beforeEach(function () {
    tree = createComponent(Grid, {
      selectedGenerator: {},
      generators: generatorsList,
      gridItemSelected: sinon.stub()
    });
    renderOutput = tree.getRenderOutput();
  });

  it('should create all grid items from generator list', function () {
    expect(
      generatorsList.length
    ).toBe(
      renderOutput.props.children.length
    );
  });

  it('should have a grid item for each generator name', function () {
    generatorsList.forEach(function (generator, index) {
      expect(
        generator.name
      ).toBe(
        renderOutput.props.children[index].key
      );
    });
  });
});
