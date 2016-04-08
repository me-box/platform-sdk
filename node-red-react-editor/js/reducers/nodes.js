import { REQUEST_NODES, RECEIVE_NODES, NODE_DROPPED, NODE_MOUSE_DOWN, NODE_DOUBLE_CLICKED, NODE_CANCEL_CLICKED, NODE_MOUSE_ENTER, NODE_MOUSE_LEAVE, MOUSE_UP, MOUSE_MOVE} from '../constants/ActionTypes';
import { NODE_WIDTH, NODE_HEIGHT, GRID_SIZE} from '../constants/ViewConstants';
import {calculateTextWidth} from '../utils/utils';

function createActiveNode(nt, def, x, y){
  
  let _def = Object.assign({},def);

  _def.label  = _def.label ? _def.label : "";

  try {
        _def.label  = (typeof _def.label  === "function" ? _def.label.call(_def) : _def.label ) || _def.label ;
  } catch(err) {
        console.log(`Definition error: ${d.type}.label`,err);
        _def.label = nt;
  }

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
    w: Math.max(NODE_WIDTH,GRID_SIZE*(Math.ceil((calculateTextWidth(_def.label, "node_label", 50)+(_def.inputs>0?7:0))/GRID_SIZE))),
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

export default function nodes(state = {isFetching:false, didInvalidate:false, nodes:[], activeNodes:[], draggingNode: null, selected: null}, action) {
  
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

    case MOUSE_UP:
      return Object.assign({}, state, {
        draggingNode: null,
      });
    

    case NODE_MOUSE_DOWN:
      
      return Object.assign({}, state, {
        draggingNode: action.node.id,
      })

    case NODE_DOUBLE_CLICKED:
     
      return Object.assign({}, state, {
        draggingNode: null,
        selected: action.node,
      })
      return state;

    case MOUSE_MOVE:
      
      if (state.draggingNode != null){

        return Object.assign({}, state, {
            activeNodes:  state.activeNodes.map((node)=>{
                if (node.id === state.draggingNode ){
                  node.x = action.x;
                  node.y = action.y;
                }
                return node;
            })
        });
      }
      return state;

    case NODE_CANCEL_CLICKED:
      return Object.assign({}, state, {
        selected: null,
      })
      

	  default:
	    return state;
  }
}
