'use strict';

var materialColors = require('material-colors/dist/colors.json');

module.exports = (function getAvailableColors(fromColors) {

  var arr = [];
  var stripColors = ['white', 'black'];

  Object.keys(fromColors).forEach(function (key) {

    if (stripColors.indexOf(key) > -1) {
      return;
    }
    Object.keys(fromColors[key]).forEach(function (colorKey) {
      arr.push(fromColors[key][colorKey]);
    });
  });

  return arr;
})(materialColors);

