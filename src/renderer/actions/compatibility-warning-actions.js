import { shell } from 'electron';
import {
  COMPATIBILITY_LINK_CLICKED
} from './action-types';

export function linkClicked() {
  shell.openExternal('https://github.com/yeoman/yeoman-app');
  return {
    type: COMPATIBILITY_LINK_CLICKED
  };
}
