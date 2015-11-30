import ipc from 'ipc';
import {
  SUBMIT_FORM,
  SELECT_FOLDER,
  SUBMIT_SELECTED_FOLDER
} from './action-types';

export function submitForm(generatorName, answers) {
  ipc.send('context-generator', 'generator:prompt-answer', answers);
  return {
    type: SUBMIT_FORM,
    answers
  };
}

export function selectFolder() {
  ipc.send('context-appwindow', 'open-dialog');
  return {
    type: SELECT_FOLDER
  };
}

export function submitSelectedFolder(generatorName, answers) {
  ipc.send('context-generator', 'generator:run', generatorName, answers.cwd);
  return {
    type: SUBMIT_SELECTED_FOLDER,
    generatorName,
    answers
  };
}
