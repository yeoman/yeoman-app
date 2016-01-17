import { margin } from '../prompt-form';
const checkboxItemHeight = 38;

export default {
  list: {
    margin: '35px 20px'
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    height: checkboxItemHeight,
    alignItems: 'center',
    margin: `0px ${margin}px`
  },
  label: {
    order: 2,
    marginLeft: (margin / 2)
  }
};


