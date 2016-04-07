import counter from './counter';
import nodes from  './nodes';
import types from  './nodetypes';
import mouse from './mouse';
import ports from './ports';

import {routerReducer} from 'react-router-redux';

const rootReducers = {
  counter, 
  nodes,
  types,
  mouse,
  ports,
  routing: routerReducer,
};

export default rootReducers;
