import materialColors from 'material-colors/dist/colors.json';

let arr = [];
const stripColors = ['white', 'black'];

Object.keys(materialColors)
  .filter(color => stripColors.indexOf(color) === -1)
  .forEach(function (key) {
    Object.keys(materialColors[key]).forEach((colorKey) => {
      arr.push(materialColors[key][colorKey]);
    });
  });

export default arr;

