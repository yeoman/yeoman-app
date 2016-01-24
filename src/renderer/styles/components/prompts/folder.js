import base from '../prompt-form';

export default {
  button: {
    margin: `56px ${base.margin}px 0px ${base.margin}px`
  },
  display: {
    margin: base.margin,
    marginTop: (base.margin / 2),
    wordWrap: 'break-word',
    maxWidth: (base.width - (base.margin * 2))
  }
};

