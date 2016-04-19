import { REQUEST_NODES, RECEIVE_NODES, NODE_DROPPED, NODE_CHANGED, NODE_MOUSE_DOWN, NODE_DOUBLE_CLICKED,  DIALOGUE_OK, DIALOGUE_CANCEL, NODE_MOUSE_ENTER, NODE_MOUSE_LEAVE, MOUSE_UP, MOUSE_MOVE} from '../constants/ActionTypes';
import { NODE_WIDTH, NODE_HEIGHT, GRID_SIZE} from '../constants/ViewConstants';
import {calculateTextWidth} from '../utils/utils';

function createActiveNode(nt, def, x, y){
  
  let _def = Object.assign({},def);

  let node = {
    id:(1+Math.random()*4294967295).toString(16),
    z:1,
    type: nt,
    _def: _def,
    _: _def._,
    inputs: _def.inputs || 0,
    outputs: _def.outputs,
    changed: true,
    selected: true,
    dirty: true,
    h: Math.max(NODE_HEIGHT,(_def.outputs||0) * 15),
    x: x,
    y: y,
  }

  //create label
  try {
        node.label  = (typeof _def.label  === "function" ? _def.label.bind(_def).call() : _def.label ) || _def.label ;
  } catch(err) {
       console.log(`Definition error: ${_def.type}.label`,err);
        node.label = nt;
  }

  node.w = Math.max(NODE_WIDTH,GRID_SIZE*(Math.ceil((calculateTextWidth(node.label, "node_label", 50)+(_def.inputs>0?7:0))/GRID_SIZE)));

  //create label style
  if (_def.labelStyle){
      try{
        node.labelStyle = (typeof _def.labelStyle === "function") ? _def.labelStyle.bind(_def).call() : _def.labelStyle || "";    
      }catch (err){
                console.log(`Definition error: ${d.type}.labelStyle`,err);
      }
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


function updateNode(current, changes){
  let _n = Object.assign(current, changes);

  try {
        _n.label  = (typeof _n._def.label  === "function" ? _n._def.label.bind(_n).call() : _n._def.label ) || _n._def.label ;
  } catch(err) {
       console.log(`Definition error: ${_n.type}.label`,err);
        _n.label = _n.nt;
  }

  if (_n._def.labelStyle){
      try{
        _n.labelStyle = (typeof _n._def.labelStyle === "function") ? _n._def.labelStyle.bind(_n).call() : _n._def.labelStyle || "";    
      }catch (err){
        console.log(`Definition error: ${d.type}.labelStyle`,err);
      }
  }
  
  const w = Math.max(NODE_WIDTH,GRID_SIZE*(Math.ceil((calculateTextWidth(_n.label, "node_label", 50)+(_n.inputs>0?7:0))/GRID_SIZE)));
  
  _n.w = w; 

  return _n;

}

export default function nodes(state = {isFetching:false, didInvalidate:false, nodes:[], activeNodes:[], draggingNode: null, selected: null, editingbuffer: {}}, action) {
  
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

    case NODE_CHANGED:
     
      return Object.assign({}, state, {
        editingbuffer : Object.assign({}, state.editingbuffer, {[action.property]:action.value})
      })
      return state;
    
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

    case DIALOGUE_CANCEL:
      return Object.assign({}, state, {
        selected: null,
        editingbuffer: {},
    })
    
    //set the values in current node to values in editingbuffer
    case DIALOGUE_OK:
      
     
      
      return Object.assign({}, state, {
         selected: null,
         editingbuffer: {},
         activeNodes: state.activeNodes.map((node)=>{
          if (node.id === state.selected.id){
            return updateNode(node, state.editingbuffer);
          }
          return node;
        })
    })

	  default:
	    return state;
  }
}
