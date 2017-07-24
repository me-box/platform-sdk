import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';

let __store = null;

const enhancer = compose(
  applyMiddleware(...[promiseMiddleware,thunk])
)(createStore);


export function configureStore(rootReducers, initialState) {
  console.log("ok configure store has been called!")
  if (!__store){
  		__store = enhancer(combineReducers(rootReducers), initialState);
	    __store.rootReducers = rootReducers;
  }
	return __store;
}

export function get(){
  return __store;
}

export function register(name, reducer){

  __store.asyncReducers = __store.asyncReducers || {};
  __store.asyncReducers[name] = reducer;  

  const reducers = {
    ...__store.rootReducers,
    ...__store.asyncReducers,
  }

  __store.replaceReducer(combineReducers(reducers));
}

export function unregisterAll(){
  __store.asyncReducers = {};

  const reducers = {
    ...__store.rootReducers,
  }

  __store.replaceReducer(combineReducers(reducers));
}