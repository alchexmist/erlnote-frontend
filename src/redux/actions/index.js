/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {ADD_ACCOUNT, DELETE_ACCOUNT, UPDATE_NOTES, UPDATE_ENTITY_VISIBLE} from '../constants/action-types';


export function addAccount(payload) {
  return {type: ADD_ACCOUNT, payload};
};

export function deleteAccount() {
  return {type: DELETE_ACCOUNT};
};

export function updateNotes(noteList) {
  return {type: UPDATE_NOTES, noteList};
};

export function updateEntityVisible(entityID) {
  return {type: UPDATE_ENTITY_VISIBLE, entityID: entityID};
}

