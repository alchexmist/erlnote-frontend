import {ADD_ACCOUNT} from '../constants/action-types';

const initialState = {
  account: {
    userID: null,
    username: null,
    token: null,
  },
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
    default:
      return state;
  }
};

export default rootReducer;
