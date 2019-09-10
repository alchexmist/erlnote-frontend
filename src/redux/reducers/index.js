/* eslint-disable max-len */
import {LOGOUT, ADD_ACCOUNT, ADD_TAG_NOTE, REMOVE_TAG_NOTE, UPDATE_NOTE, DELETE_NOTE, DELETE_BOARD, UPDATE_NOTES, DELETE_NOTES, DELETE_TASKLISTS, UPDATE_BOARD, UPDATE_BOARDS, DELETE_BOARDS, UPDATE_TASKLIST, UPDATE_TASKLISTS, UPDATE_ENTITY_VISIBLE, SET_USER_ACTION, ACTION_NONE, ADD_NEW_BOARD, ADD_NEW_TASKLIST, ADD_NEW_NOTE, ADD_NEW_TASK, UPDATE_TASK, ADD_TAG_TASKLIST, REMOVE_TAG_TASKLIST, DELETE_TASKLIST, DELETE_TASK} from '../constants/action-types';

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
    case UPDATE_NOTE:
      const newStateUpdateNote = Object.assign({}, state);
      const updateNoteIndex = newStateUpdateNote.notes.findIndex((t) => t.id == action.noteDataObject.id);
      if (updateNoteIndex !== -1) {
        newStateUpdateNote.notes.splice(updateNoteIndex, 1, action.noteDataObject);
      }
      return newStateUpdateNote;
    case UPDATE_NOTES:
      const updatedNotes = state.notes.filter((note) => {
        return action.noteList.map((updatedNote) => updatedNote.id).findIndex((id) => id == note.id) == -1;
      });
      return Object.assign(
          {},
          state,
          {
            notes: [...action.noteList, ...updatedNotes],
          }
      );
    case DELETE_NOTES:
      const noDeletedNotes = state.notes.filter((note) => {
        return action.noteList.map((updatedNote) => updatedNote.id).findIndex((id) => id == note.id) !== -1;
      });
      return Object.assign(
          {},
          state,
          {
            notes: noDeletedNotes.slice(),
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
    case ADD_NEW_NOTE:
      return Object.assign(
          {},
          state,
          {
            notes: [...state.notes.slice(), {id: action.id, title: action.title, body: action.body, tags: action.tags, __typename: action.__typename}],
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
    case DELETE_TASK:
      const newStateDeleteTask = Object.assign({}, state);
      const deleteTaskTasklistIndex = newStateDeleteTask.tasklists.findIndex((t) => t.id == action.taskDataObject.tasklistID);
      if (deleteTaskTasklistIndex === -1) {
        return newStateDeleteTask;
      }
      const deleteTaskIndex = newStateDeleteTask.tasklists[deleteTaskTasklistIndex].tasks.findIndex((t) => t.id == action.taskDataObject.id);
      if (deleteTaskIndex !== -1) {
        newStateDeleteTask.tasklists[deleteTaskTasklistIndex].tasks.splice(deleteTaskIndex, 1);
      }
      return newStateDeleteTask;
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
    case DELETE_BOARDS:
      const noDeletedBoards = state.boards.filter((board) => {
        return action.boardList.map((updatedBoard) => updatedBoard.id).findIndex((id) => id == board.id) !== -1;
      });
      return Object.assign(
          {},
          state,
          {
            boards: noDeletedBoards.slice(),
          }
      );
    case UPDATE_TASKLIST:
      const newStateUpdateTasklist = Object.assign({}, state);
      const updateTasklistIndex = newStateUpdateTasklist.tasklists.findIndex((t) => t.id == action.tasklistDataObject.id);
      if (updateTasklistIndex !== -1) {
        newStateUpdateTasklist.tasklists.splice(updateTasklistIndex, 1, action.tasklistDataObject);
      }
      return newStateUpdateTasklist;
      // return Object.assign(
      //     {},
      //     state,
      //     {
      //       tasklists: [...state.tasklists.filter((e) => action.tasklistDataObject.id !== e.id), action.tasklistDataObject],
      //     }
      // );
    case DELETE_TASKLISTS:
      const noDeletedTasklists = state.tasklists.filter((tasklist) => {
        return action.tasklistList.map((updatedTasklist) => updatedTasklist.id).findIndex((id) => id == tasklist.id) !== -1;
      });
      return Object.assign(
          {},
          state,
          {
            tasklists: noDeletedTasklists.slice(),
          }
      );
    case DELETE_TASKLIST:
      const newStateDeleteTasklist = Object.assign({}, state);
      const deleteTasklistIndex = newStateDeleteTasklist.tasklists.findIndex((t) => t.id == action.tasklistDataObject.tasklistID);
      if (deleteTasklistIndex !== -1) {
        newStateDeleteTasklist.tasklists.splice(deleteTasklistIndex, 1);
      }
      return newStateDeleteTasklist;
    case ADD_TAG_TASKLIST:
      const newStateAddTagTasklist = Object.assign({}, state);
      const addTagTasklistIndex = newStateAddTagTasklist.tasklists.findIndex((t) => t.id == action.tagDataObject.tasklistID);
      if (addTagTasklistIndex === -1) {
        return newStateAddTagTasklist;
      }
      if (newStateAddTagTasklist.tasklists[addTagTasklistIndex].tags && newStateAddTagTasklist.tasklists[addTagTasklistIndex].tags.findIndex((t) => t.id == action.tagDataObject.id) === -1) {
        newStateAddTagTasklist.tasklists[addTagTasklistIndex].tags.push({id: action.tagDataObject.id, name: action.tagDataObject.name, __typename: 'Tag'});
        // newStateAddTagTasklist.tasklists[addTagTasklistIndex].tags.sort(function(a, b) {
        //   if (a.name > b.name) {
        //     return 1;
        //   }
        //   if (a.name < b.name) {
        //     return -1;
        //   }
        //   // a must be equal to b
        //   return 0;
        // });
      }
      return newStateAddTagTasklist;
    case REMOVE_TAG_TASKLIST:
      const newStateRemoveTagTasklist = Object.assign({}, state);
      const removeTagTasklistIndex = newStateRemoveTagTasklist.tasklists.findIndex((t) => t.id == action.tagDataObject.tasklistID);
      if (removeTagTasklistIndex === -1) {
        return newStateRemoveTagTasklist;
      }
      if (newStateRemoveTagTasklist.tasklists[removeTagTasklistIndex].tags) {
        const removeTagTasklistTargetIndex = newStateRemoveTagTasklist.tasklists[removeTagTasklistIndex].tags.findIndex((t) => t.name == action.tagDataObject.name);
        if (removeTagTasklistTargetIndex !== -1) {
          newStateRemoveTagTasklist.tasklists[removeTagTasklistIndex].tags.splice(removeTagTasklistTargetIndex, 1);
          // newStateRemoveTagTasklist.tasklists[removeTagTasklistIndex].tags.sort(function(a, b) {
          //   if (a.name > b.name) {
          //     return 1;
          //   }
          //   if (a.name < b.name) {
          //     return -1;
          //   }
          //   // a must be equal to b
          //   return 0;
          // });
          return newStateRemoveTagTasklist;
        }
      }
      return newStateRemoveTagTasklist;
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
    case ADD_TAG_NOTE:
      const newStateAddTagNote = Object.assign({}, state);
      const addTagNoteIndex = newStateAddTagNote.notes.findIndex((t) => t.id == action.tagDataObject.noteID);
      if (addTagNoteIndex === -1) {
        return newStateAddTagNote;
      }
      if (newStateAddTagNote.notes[addTagNoteIndex].tags && newStateAddTagNote.notes[addTagNoteIndex].tags.findIndex((t) => t.id == action.tagDataObject.id) === -1) {
        newStateAddTagNote.notes[addTagNoteIndex].tags.push({id: action.tagDataObject.id, name: action.tagDataObject.name, __typename: 'Tag'});
        // newStateAddTagTasklist.tasklists[addTagTasklistIndex].tags.sort(function(a, b) {
        //   if (a.name > b.name) {
        //     return 1;
        //   }
        //   if (a.name < b.name) {
        //     return -1;
        //   }
        //   // a must be equal to b
        //   return 0;
        // });
      }
      return newStateAddTagNote;
    case REMOVE_TAG_NOTE:
      const newStateRemoveTagNote = Object.assign({}, state);
      const removeTagNoteIndex = newStateRemoveTagNote.notes.findIndex((t) => t.id == action.tagDataObject.noteID);
      if (removeTagNoteIndex === -1) {
        return newStateRemoveTagNote;
      }
      if (newStateRemoveTagNote.notes[removeTagNoteIndex].tags) {
        const removeTagNoteTargetIndex = newStateRemoveTagNote.notes[removeTagNoteIndex].tags.findIndex((t) => t.name == action.tagDataObject.name);
        if (removeTagNoteTargetIndex !== -1) {
          newStateRemoveTagNote.notes[removeTagNoteIndex].tags.splice(removeTagNoteTargetIndex, 1);
          // newStateRemoveTagTasklist.tasklists[removeTagTasklistIndex].tags.sort(function(a, b) {
          //   if (a.name > b.name) {
          //     return 1;
          //   }
          //   if (a.name < b.name) {
          //     return -1;
          //   }
          //   // a must be equal to b
          //   return 0;
          // });
          return newStateRemoveTagNote;
        }
      }
      return newStateRemoveTagNote;
    case DELETE_NOTE:
      const newStateDeleteNote = Object.assign({}, state);
      const deleteNoteIndex = newStateDeleteNote.notes.findIndex((t) => t.id == action.noteDataObject.noteID);
      if (deleteNoteIndex !== -1) {
        newStateDeleteNote.notes.splice(deleteNoteIndex, 1);
      }
      return newStateDeleteNote;
    case DELETE_BOARD:
      const newStateDeleteBoard = Object.assign({}, state);
      const deleteBoardIndex = newStateDeleteBoard.boards.findIndex((t) => t.id == action.boardDataObject.boardID);
      if (deleteBoardIndex !== -1) {
        newStateDeleteBoard.boards.splice(deleteBoardIndex, 1);
      }
      return newStateDeleteBoard;
    default:
      return state;
  }
};

export default rootReducer;
