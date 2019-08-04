/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {ADD_ACCOUNT, DELETE_ACCOUNT, UPDATE_NOTES, UPDATE_BOARDS, UPDATE_TASKLISTS, UPDATE_ENTITY_VISIBLE, SET_USER_ACTION} from '../constants/action-types';


export function addAccount(payload) {
  return {type: ADD_ACCOUNT, payload: payload};
};

export function deleteAccount() {
  return {type: DELETE_ACCOUNT};
};

export function updateNotes(noteList) {
  return {type: UPDATE_NOTES, noteList: noteList};
};

export function updateBoards(boardList) {
  return {type: UPDATE_BOARDS, boardList: boardList};
};

export function updateTasklists(tasklistList) {
  return {type: UPDATE_TASKLISTS, tasklistList: tasklistList};
};

export function updateEntityVisible(entityID) {
  return {type: UPDATE_ENTITY_VISIBLE, entityID: entityID};
}

export function setUserAction(userAction) {
  return {type: SET_USER_ACTION, userActionName: userAction.userActionName, actionEntityID: userAction.actionEntityID};
}

