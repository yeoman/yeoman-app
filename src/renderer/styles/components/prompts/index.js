import base from '../prompt-form';

export default {
  container: {
    minHeight: base.height,
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '18px',
    padding: `0px ${base.margin}px`,
    height: (base.height / 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
};

