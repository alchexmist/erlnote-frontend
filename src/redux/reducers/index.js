import {ADD_ACCOUNT} from '../constants/action-types';

const initialState = {
  account: {
    userID: null,
    token: null,
  },
};


// eslint-disable-next-line require-jsdoc
function rootReducer(state = initialState, action) {
  if (action.type === ADD_ACCOUNT) {
    return Object.assign(
        {},
        state,
        {
          account: {
            userID: action.payload.userID,
            token: action.payload.token,
          },
        }
    );
  }
  return state;
};

export default rootReducer;
