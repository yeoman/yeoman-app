import { width, margin } from '../prompt-form';

export default {
  button: {
    margin: `56px ${margin}px 0px ${margin}px`
  },
  display: {
    margin: margin,
    marginTop: (margin / 2),
    wordWrap: 'break-word',
    maxWidth: (width - (margin * 2))
  }
};

