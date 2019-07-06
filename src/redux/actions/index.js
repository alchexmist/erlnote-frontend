import {ADD_ACCOUNT} from '../constants/action-types';

// eslint-disable-next-line require-jsdoc
export function addAccount(payload) {
  return {type: ADD_ACCOUNT, payload};
};
