import { combineReducers } from 'redux';
import counter from './counter';
import nodes from  './nodes';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  counter, 
  nodes,
  routing: routerReducer,
});

export default rootReducer;
