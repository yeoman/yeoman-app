import { width, height } from '../prompt-form';

export default {
  options: {
    width: width,
    height: (height / 2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noActive: {
    display: 'block',
    backgroundColor: '#ff5252'
  },
  yesActive: {
    display: 'block',
    backgroundColor: '#69f0ae'
  }
};

