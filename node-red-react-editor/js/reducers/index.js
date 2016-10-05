import nodes from  './nodes';
import types from  './nodetypes';
import mouse from './mouse';
import ports from './ports';
import editor from './editor';
import screen from './screen';
import repos from './repos';
import tabs from './tabs';
import publisher from './publisher';
import apps from './apps';
import network from './network';
import help from './help';
import {routerReducer} from 'react-router-redux';

const rootReducers = {
  nodes,
  tabs,
  types,
  mouse,
  ports,
  editor,
  screen,
  repos,
  publisher,
  apps,
  network,
  help,
  routing: routerReducer,
};

export default rootReducers;
