import { height, margin } from '../prompt-form';

export default {
  container: {
    minHeight: height,
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '18px',
    padding: `0px ${margin}px`,
    height: (height / 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
};

