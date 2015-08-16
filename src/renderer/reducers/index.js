import { combineReducers } from 'redux';
import generator from './generator';
import prompt from './prompt';

const rootReducer = combineReducers({
  generator,
  prompt
});

export default rootReducer;