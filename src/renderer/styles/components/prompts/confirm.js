import base from '../prompt-form';

export default {
  options: {
    width: base.width,
    height: (base.height / 2),
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

