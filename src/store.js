import Immutable from 'seamless-immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogicMiddleware } from 'dot-logic';

import logic from 'logic';
import { createReducer } from 'reducers';
import shallowEqualObjects from 'utils/shallowEqualObjects';
import { objectNoop } from 'utils/noop';

import { connect as connectRedux } from 'react-redux';

const initialState = {};

export const logicMiddleware = createLogicMiddleware(logic, {});

export function configureStore(initialState = {}) { // eslint-disable-line
  // Create the store with two middlewares
  const middlewares = [
    logicMiddleware,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? // eslint-disable-line
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose; // eslint-disable-line
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    Immutable(initialState),
    composeEnhancers(...enhancers)
  );

  return store;
}

export const store = configureStore(initialState);

export const connect = connectRedux;
