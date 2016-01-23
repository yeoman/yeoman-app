import { PropTypes } from 'react';

export default {
  propTypes: {
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
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
