import { combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducers from '../reducers';

const enhancer = applyMiddleware(thunk);


export  default function configureStore(initialState) {
  const store = createStore(combineReducers(rootReducers), initialState, enhancer);
  store.asyncReducers = [];
  return store;
}

export function register(store, name, reducer){

  store.asyncReducers[name] = reducer;  

  let reducers = {
    ...rootReducers,
    ...store.asyncReducers,
  }

  store.replaceReducer(combineReducers(reducers));
}
