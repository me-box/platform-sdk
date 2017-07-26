/*const {configureStore, register, unregisterAll, get} = storelib;

module.exports = {
   configureStore,
   register,
   unregisterAll,
   get
}*/

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import rootReducers from '../reducer';

const middlewares = [promiseMiddleware, thunk];

const enhancer = compose(
  applyMiddleware(...middlewares)  
)(createStore);

export function configureStore(initialState) {
 	return enhancer(combineReducers(rootReducers), initialState);
}

export function register(store, name, reducer){

  store.asyncReducers = store.asyncReducers || {};
  store.asyncReducers[name] = reducer;  

  const reducers = {
    ...rootReducers,
    ...store.asyncReducers,
  }

  store.replaceReducer(combineReducers(reducers));
}

export function unregisterAll(store){
  store.asyncReducers = {};

  const reducers = {
    ...rootReducers,
  }

  store.replaceReducer(combineReducers(reducers));
}