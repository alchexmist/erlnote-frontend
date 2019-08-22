/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {LOGOUT, ADD_ACCOUNT, DELETE_ACCOUNT, UPDATE_NOTES, UPDATE_BOARD, UPDATE_BOARDS, ADD_NEW_BOARD, UPDATE_TASKLISTS, ADD_NEW_TASKLIST, UPDATE_ENTITY_VISIBLE, SET_USER_ACTION, UPDATE_TASKLIST} from '../constants/action-types';


export function logout() {
  return {type: LOGOUT};
};

export function addAccount(payload) {
  return {type: ADD_ACCOUNT, payload: payload};
};

export function deleteAccount() {
  return {type: DELETE_ACCOUNT};
};

export function updateNotes(noteList) {
  return {type: UPDATE_NOTES, noteList: noteList};
};

export function updateBoard(boardDataObject) {
  return {type: UPDATE_BOARD, boardDataObject: boardDataObject};
};

export function updateBoards(boardList) {
  return {type: UPDATE_BOARDS, boardList: boardList};
};

export function updateTasklist(tasklistDataObject) {
  return {type: UPDATE_TASKLIST, tasklistDataObject: tasklistDataObject};
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

export function addNewBoard(boardData) {
  return {type: ADD_NEW_BOARD, id: boardData.boardID, title: boardData.boardTitle, text: boardData.boardText, __typename: 'Board'};
}

export function addNewTasklist(tasklistData) {
  return {type: ADD_NEW_TASKLIST, id: tasklistData.tasklistID, title: tasklistData.tasklistTitle, tasks: tasklistData.tasklistTasks, tags: tasklistData.tasklistTags, __typename: 'Tasklist'};
}

