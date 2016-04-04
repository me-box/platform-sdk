import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import rootReducers from '../reducers';
import DevTools from '../containers/DevTools';

const enhancer = compose(
  applyMiddleware(thunk),
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&#]+)\b/
    )
  )
);

export  default function configureStore(initialState) {
  
  const store = createStore(combineReducers(rootReducers), initialState, enhancer);

  store.asyncReducers = [];

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

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
