import { REQUEST_NODES, RECEIVE_NODES, NODE_DROPPED, NODE_MOUSE_DOWN, NODE_DOUBLE_CLICKED, NODE_MOUSE_ENTER, NODE_MOUSE_LEAVE, MOUSE_UP, MOUSE_MOVE} from '../constants/ActionTypes';
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

export default function nodes(state = {isFetching:false, didInvalidate:false, nodes:[], activeNodes:[], draggingNode: null}, action) {
  
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

	  default:
	    return state;
  }
}
