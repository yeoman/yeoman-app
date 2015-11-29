import {
  GENERATOR_INSTALLED_GENERATORS,
  GENERATOR_PROMPT_QUESTIONS,
  GENERATOR_INSTALL,
  GENERATOR_DONE,
  FOLDER_SELECTED
} from './action-types';

import insight from '../utils/insight.js';

export function generatorsDataReceived(generators) {
  insight.sendEvent('generator', 'total-installed-generators', 'Total installed generators', generators.length);

  return {
    type: GENERATOR_INSTALLED_GENERATORS,
    generators
  };
}

export function questionPrompt(questions) {
  return {
    type: GENERATOR_PROMPT_QUESTIONS,
    questions
  };
}

export function generatorInstall() {
  return {
    type: GENERATOR_INSTALL
  };
}

export function generatorDone() {
  insight.sendEvent('generator', 'done');
  return {
    type: GENERATOR_DONE
  };
}

export function folderSelected(cwd) {
  return {
    type: FOLDER_SELECTED,
    cwd
  };
}
