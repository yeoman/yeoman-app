'use strict';

var materialColors = require('material-colors/dist/colors.json');

module.exports = (function getAvailableColors(fromColors) {

  var arr = [];

  Object.keys(fromColors).forEach(function (key) {
    Object.keys(fromColors[key]).forEach(function (colorKey) {
      arr.push(fromColors[key][colorKey]);
    });
  });

  return arr;
})(materialColors);

