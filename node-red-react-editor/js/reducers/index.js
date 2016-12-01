import nodes from  './nodes';
import types from  './nodetypes';
import mouse from './mouse';
import ports from './ports';
import editor from './editor';
import screen from './screen';
import repos from './repos';
import tabs from './tabs';
import publisher from './publisher';
import samples from './samples';
import network from './network';
import help from './help';

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
  network,
  help,
  samples,
};

export default rootReducers;
