/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {ADD_ACCOUNT, DELETE_ACCOUNT} from '../constants/action-types';


export function addAccount(payload) {
  return {type: ADD_ACCOUNT, payload};
};

export function deleteAccount() {
  return {type: DELETE_ACCOUNT};
};

