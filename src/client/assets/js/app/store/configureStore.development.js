import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistState } from 'redux-devtools';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
//import createLogger from 'redux-logger';

import rootReducers from '../reducer';
import DevTools from '../DevTools';

/**
 * Entirely optional.
 * This tiny library adds some functionality to your DevTools,
 * by logging actions/state to your console. Used in conjunction
 * with your standard DevTools monitor gives you great flexibility.
 */
//const logger = createLogger();

const middlewares = [promiseMiddleware, /*logger,*/ thunk, require('redux-immutable-state-invariant')()];
let store;

// By default we try to read the key from ?debug_session=<key> in the address bar
const getDebugSessionKey = function () {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length) ? matches[1] : null;
};

const enhancer = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  //persistState(getDebugSessionKey())
);

export  function configureStore(initialState) {
   store = createStore(combineReducers(rootReducers), initialState, enhancer);

  // Enable hot module replacement for reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {

  if (module.hot) {
      module.hot.accept('../reducer', () =>
        store.replaceReducer(require('../reducer').default)
      );
    }

    /*module.hot.accept('../reducer', () => {
      const nextReducers = require('../reducer').default;
      store.replaceReducer(nextReducer);
    });*/
  }
  
  return store;
}


export function register(name, reducer){

  //NOTE THAT DEVTOOLS CAUSES OLD ACTIONS TO BE REPLAYED WHEN HOTRELOAD IS TRUE, WHICH CAN CAUSE STRANGE BEHAVIOUR
  //see: https://github.com/gaearon/redux-devtools/issues/167


  store.asyncReducers = store.asyncReducers || {};
  store.asyncReducers[name] = reducer;  

  const reducers = {
    ...rootReducers,
    ...store.asyncReducers,
  }


  store.replaceReducer(combineReducers(reducers));
}

export function unregisterAll(){
 
  store.asyncReducers = {};

  const reducers = {
    ...rootReducers,
  }

  store.replaceReducer(combineReducers(reducers));
}

export function unregister(name){
  if (!store.asyncReducers)
    return

  if (store.asyncReducers[name]){
    delete store.asyncReducers[name];
    const reducers = {
      ...rootReducers,
      ...store.asyncReducers,
    }
    store.replaceReducer(combineReducers(reducers));
  }
}