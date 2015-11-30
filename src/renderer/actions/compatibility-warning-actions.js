import {
  COMPATIBILITY_LINK_CLICKED
} from './action-types';

export function linkClicked() {
  require('shell').openExternal('https://github.com/yeoman/yeoman-app');
  return {
    type: COMPATIBILITY_LINK_CLICKED
  };
}
