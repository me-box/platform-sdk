import counter from './counter';
import nodes from  './nodes';
import types from  './nodetypes';
import mouse from './mouse';
import ports from './ports';
import editor from './editor';
import screen from './screen';

import {routerReducer} from 'react-router-redux';

const rootReducers = {
  counter, 
  nodes,
  types,
  mouse,
  ports,
  editor,
  screen,
  routing: routerReducer,
};

export default rootReducers;
