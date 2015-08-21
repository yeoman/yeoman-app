import React, { PropTypes } from 'react';

export default PromptMixin = {
  propTypes: {
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    defaultAnswer: PropTypes.any,
    filter: PropTypes.func,
    choices: PropTypes.arrayOf(PropTypes.any)
  },

  getDefaultProps: function () {
    return {
      filter: (value) => value,
      choices: []
    };
  }
};
