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
let store;

const enhancer = compose(
  applyMiddleware(...middlewares)  
)(createStore);

export function configureStore(initialState) {

  store = enhancer(combineReducers(rootReducers), initialState);
   console.log("configred store", store);
 	return store;
}

export function register(name, reducer){

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

  if (store.asyncReducers[name]){
    delete store.asyncReducers[name];
    const reducers = {
      ...rootReducers,
      ...store.asyncReducers,
    }
    store.replaceReducer(combineReducers(reducers));
  }
}