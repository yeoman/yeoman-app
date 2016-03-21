import React from 'react';
import sd from 'skin-deep';

export default function createComponent(component, props) {
  return sd.shallowRender(React.createElement(component, props));
}

