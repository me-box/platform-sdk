import { REQUEST_NODES, RECEIVE_NODES, NODE_DROPPED} from '../constants/ActionTypes';
import { NODE_WIDTH, NODE_HEIGHT} from '../constants/ViewConstants';

function createActiveNode(nt, def, x, y){
  
  const _def = Object.assign({},def);

  let node = {
    id:(1+Math.random()*4294967295).toString(16),
    z:1,
    type: nt,
    _def: _def,
    inputs: _def.inputs || 0,
    outputs: _def.outputs,
    changed: true,
    selected: true,
    dirty: true,
    w: NODE_WIDTH,
    h: Math.max(NODE_HEIGHT,(_def.outputs||0) * 15),
    x: x,
    y: y,
  }
  
  for (var d in _def.defaults) {
      if (_def.defaults.hasOwnProperty(d)) {
          node[d] = _def.defaults[d].value;
      }
  }

  /*if (_def.onadd) {
      try {
          _def.onadd.call(nn);
      } catch(err) {
          console.log("onadd:",err);
      }
  }*/
  
  return node;
}

export default function nodes(state = {isFetching:false, didInvalidate:false, nodes:[], activeNodes:[]}, action) {
  switch (action.type) {
	  
	  case  REQUEST_NODES:
	    return Object.assign({}, state, {
        	isFetching: true,
        	didInvalidate: false
      	})
	  
	  case RECEIVE_NODES:
	  	return Object.assign({}, state, {
        	isFetching: false,
        	didInvalidate: false,
        	nodes: action.nodes,
        	lastUpdated: action.receivedAt
      	})

    case NODE_DROPPED:
        return Object.assign({}, state, {
            activeNodes: [  ...state.activeNodes,
                            createActiveNode(action.nt, action.def, action.x, action.y)
                          ]
        })

	  default:
	    return state;
  }
}
