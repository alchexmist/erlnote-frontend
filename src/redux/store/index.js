import {createStore} from 'redux';
import rootReducer from '../reducers/index';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    /* preloadedState, */
    // composeEnhancers(
    //     applyMiddleware(...middleware)
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
