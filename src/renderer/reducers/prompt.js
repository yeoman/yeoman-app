import {
  FOLDER_SELECTED
} from '../actions/action-types';

const initialState = '';

export default function prompt(state = initialState, action) {
  switch (action.type) {
    case FOLDER_SELECTED:
      state = action.cwd;
      break;
    default:
      return state;
  }
  return state;
}
