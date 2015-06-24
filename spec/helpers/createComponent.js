'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

// Thanks for sharing, Simon Smith.
// https://gist.github.com/simonsmith/b478d6166acd57829d15

module.exports = function createComponent (component, props) {
  var shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(React.createElement(component, props));
  return shallowRenderer.getRenderOutput();
};
