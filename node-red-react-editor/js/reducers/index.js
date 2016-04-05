import counter from './counter';
import nodes from  './nodes';
import types from  './nodetypes';
import {routerReducer} from 'react-router-redux';

const rootReducers = {
  counter, 
  nodes,
  types,
  routing: routerReducer,
};

export default rootReducers;
