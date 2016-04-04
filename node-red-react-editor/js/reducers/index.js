import counter from './counter';
import nodes from  './nodes';
import {routerReducer} from 'react-router-redux';

const rootReducers = {
  counter, 
  nodes,
  routing: routerReducer,
};

export default rootReducers;
