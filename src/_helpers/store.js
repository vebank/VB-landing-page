
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import logger from 'redux-logger';

import rootReducer from '../reducers';

const inititalState = {};

var middlewares = [];

middlewares.push(thunk);
middlewares.push(promise);


let middlewareThunk = applyMiddleware(...middlewares);


let devTools;
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
    devTools = a => a;
} else {
    middlewareThunk = applyMiddleware(thunk, logger)
    devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : compose
}

const store = createStore(
    rootReducer,
    inititalState,
    compose(middlewareThunk, devTools)
);

export default store;