import { Styles } from 'material-ui';

// excludes problematic colors
const stripColors = [
  'brown700',
  'brown800',
  'brown900',
  'blueGrey700',
  'blueGrey800',
  'blueGrey900',
  'grey50',
  'grey100',
  'grey200',
  'grey600',
  'grey700',
  'grey800',
  'grey900',
  'white',
  'black',
  'transparent',
  'fullBlack',
  'darkBlack',
  'lightBlack',
  'minBlack',
  'faintBlack',
  'fullWhite',
  'darkWhite',
  'lightWhite'
];

export default Object.keys(Styles.Colors)
  .filter(color => stripColors.indexOf(color) === -1)
  .map(key => Styles.Colors[key]);

