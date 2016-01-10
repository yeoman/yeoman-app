import { ipcRenderer } from 'electron';
import {
  SUBMIT_FORM,
  SELECT_FOLDER,
  SUBMIT_SELECTED_FOLDER
} from './action-types';

export function submitForm(generatorName, answers) {
  ipcRenderer.send('context-generator', 'generator:prompt-answer', answers);
  return {
    type: SUBMIT_FORM,
    answers
  };
}

export function selectFolder() {
  ipcRenderer.send('context-appwindow', 'open-dialog');
  return {
    type: SELECT_FOLDER
  };
}

export function submitSelectedFolder(generatorName, answers) {
  ipcRenderer.send('context-generator', 'generator:run', generatorName, answers.cwd);
  return {
    type: SUBMIT_SELECTED_FOLDER,
    generatorName,
    answers
  };
}
