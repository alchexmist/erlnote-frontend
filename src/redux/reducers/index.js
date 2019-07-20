/* eslint-disable max-len */
import {ADD_ACCOUNT, UPDATE_NOTES, UPDATE_ENTITY_VISIBLE} from '../constants/action-types';

const initialState = {
  account: {
    userID: null,
    username: null,
    token: null,
  },
  entityVisible: 'notes',
  boards: [],
  notes: [],
  tasklists: [],
};


// eslint-disable-next-line require-jsdoc
function rootReducer(state = initialState, action) {
  switch (action.type) {
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
      return Object.assign(
          {},
          state,
          {
            notes: action.noteList,
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
    default:
      return state;
  }
};

export default rootReducer;
