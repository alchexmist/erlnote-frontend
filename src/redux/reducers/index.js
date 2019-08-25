/* eslint-disable max-len */
import {LOGOUT, ADD_ACCOUNT, UPDATE_NOTES, UPDATE_BOARD, UPDATE_BOARDS, UPDATE_TASKLIST, UPDATE_TASKLISTS, UPDATE_ENTITY_VISIBLE, SET_USER_ACTION, ACTION_NONE, ADD_NEW_BOARD, ADD_NEW_TASKLIST, ADD_NEW_TASK, UPDATE_TASK} from '../constants/action-types';

const initialState = {
  account: {
    userID: null,
    username: null,
    token: null,
  },
  userAction: ACTION_NONE,
  userActionEntityID: '',
  entityVisible: 'notes',
  boards: [],
  notes: [],
  tasklists: [],
};


// eslint-disable-next-line require-jsdoc
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case ADD_ACCOUNT:
      return Object.assign(
          {},
          state,
          {
            account: {
              userID: action.payload.userID,
              username: action.payload.username,
              token: action.payload.token,
            },
          }
      );
    case UPDATE_NOTES:
      const updatedNotes = state.notes.filter((note) => {
        // const newIDs = action.noteList.map((updatedNote) => updatedNote.id);
        // const notFoundIDs = newIDs.findIndex((id) => id == note.id) == -1;
        // return notFoundIDs;
        return action.noteList.map((updatedNote) => updatedNote.id).findIndex((id) => id == note.id) == -1;
      });
      return Object.assign(
          {},
          state,
          {
            notes: [...action.noteList, ...updatedNotes],
          }
      );
    case ADD_NEW_BOARD:
      return Object.assign(
          {},
          state,
          {
            boards: [...state.boards.slice(), {id: action.id, title: action.title, text: action.text, __typename: action.__typename}],
          }
      );
    case ADD_NEW_TASKLIST:
      return Object.assign(
          {},
          state,
          {
            tasklists: [...state.tasklists.slice(), {id: action.id, title: action.title, tasks: action.tasks, tags: action.tags, __typename: action.__typename}],
          }
      );
    case ADD_NEW_TASK:
      const targetTasklistIndex = state.tasklists.findIndex((t) => t.id == action.taskDataObject.tasklistID);
      if (targetTasklistIndex === -1) {
        return state;
      } else {
        const newState = Object.assign({}, state);
        newState.tasklists[targetTasklistIndex].tasks.push({id: action.taskDataObject.id, name: action.taskDataObject.name, description: action.taskDataObject.description, state: action.taskDataObject.state, priority: action.taskDataObject.priority, startDatetime: action.taskDataObject.startDatetime, endDatetime: action.taskDataObject.endDatetime, __typename: 'Task'});
        return newState;
      };
    case UPDATE_TASK:
      const updateTaskTasklistIndex = state.tasklists.findIndex((t) => t.id == action.taskDataObject.tasklistID);
      if (updateTaskTasklistIndex === -1) {
        return state;
      } else {
        const newState = Object.assign({}, state);
        const updatedTasks = state.tasklists[updateTaskTasklistIndex].tasks.slice();
        const updateTaskTaskIndex = updatedTasks.findIndex((t) => t.id == action.taskDataObject.id);
        updatedTasks.splice(updateTaskTaskIndex, 1, {id: action.taskDataObject.id, name: action.taskDataObject.name, description: action.taskDataObject.description, state: action.taskDataObject.state, priority: action.taskDataObject.priority, startDatetime: action.taskDataObject.startDatetime, endDatetime: action.taskDataObject.endDatetime, __typename: 'Task'});
        newState.tasklists[updateTaskTasklistIndex].tasks = updatedTasks;

        return newState;
      };
    case UPDATE_BOARD:
      return Object.assign(
          {},
          state,
          {
            boards: [...state.boards.filter((e) => action.boardDataObject.id !== e.id), action.boardDataObject],
          }
      );
    case UPDATE_BOARDS:
      const updatedBoards = state.boards.filter((board) => {
        // const newIDs = action.noteList.map((updatedNote) => updatedNote.id);
        // const notFoundIDs = newIDs.findIndex((id) => id == note.id) == -1;
        // return notFoundIDs;
        return action.boardList.map((updatedBoard) => updatedBoard.id).findIndex((id) => id == board.id) == -1;
      });
      return Object.assign(
          {},
          state,
          {
            // boards: action.boardList,
            boards: [...action.boardList, ...updatedBoards],
          }
      );
    case UPDATE_TASKLIST:
      return Object.assign(
          {},
          state,
          {
            tasklists: [...state.tasklists.filter((e) => action.tasklistDataObject.id !== e.id), action.tasklistDataObject],
          }
      );
    case UPDATE_TASKLISTS:
      const updatedTasklists = state.tasklists.filter((tasklist) => {
        // const newIDs = action.noteList.map((updatedNote) => updatedNote.id);
        // const notFoundIDs = newIDs.findIndex((id) => id == note.id) == -1;
        // return notFoundIDs;
        return action.tasklistList.map((updatedTasklist) => updatedTasklist.id).findIndex((id) => id == tasklist.id) == -1;
      });
      return Object.assign(
          {},
          state,
          {
            // boards: action.boardList,
            tasklists: [...action.tasklistList, ...updatedTasklists],
          }
      );
    case UPDATE_ENTITY_VISIBLE:
      return Object.assign(
          {},
          state,
          {
            entityVisible: action.entityID,
          }
      );
    case SET_USER_ACTION:
      return Object.assign(
          {},
          state,
          {
            userAction: action.userActionName,
            userActionEntityID: action.actionEntityID,
          }
      );
    default:
      return state;
  }
};

export default rootReducer;
