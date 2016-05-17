import * as ActionType from '../constants/ActionTypes';
import { NODE_WIDTH, GRID_SIZE} from '../constants/ViewConstants';
import {calculateTextWidth, toggleItem} from '../utils/utils';


function updateNode(current, changes){

  console.log("changes are");
  console.log(changes);

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
  
  let property, value, v;

  switch (action.type) {
	  
	  case  ActionType.REQUEST_NODES:
	    return Object.assign({}, state, {
        	isFetching: true,
        	didInvalidate: false
      	})
	  
	  case ActionType.RECEIVE_NODES:
	  	return Object.assign({}, state, {
        	isFetching: false,
        	didInvalidate: false,
        	nodes: action.nodes,
        	lastUpdated: action.receivedAt
      	})

    case ActionType.NODE_DROPPED:
       
        return Object.assign({}, state, {
            activeNodes: [  ...state.activeNodes,
                            action.node,
                          ]
        })

    case ActionType.MOUSE_UP:
      return Object.assign({}, state, {
        draggingNode: null,
      });
    

    case ActionType.NODE_MOUSE_DOWN:
      
      return Object.assign({}, state, {
        draggingNode: action.node.id,
      })
    
    case ActionType.NODE_DOUBLE_CLICKED:
     
      return Object.assign({}, state, {
        draggingNode: null,
        selected: action.node,
      })
      return state;

    case ActionType.MOUSE_MOVE:
      
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

    case ActionType.DIALOGUE_CANCEL:
      return Object.assign({}, state, {
        selected: null,
        editingbuffer: {},
    })
    
    //set the values in current node to values in editingbuffer
    case ActionType.DIALOGUE_OK:
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

    case ActionType.NODE_INIT_VALUES:
     
      return Object.assign({}, state, {
        editingbuffer : action.keys,
      })


    case ActionType.NODE_UPDATE_VALUE:
      //handle array case here too?
      return Object.assign({}, state, {
        editingbuffer : Object.assign({}, state.editingbuffer, {[action.property]:action.value})
      })
  

    case ActionType.NODE_INCREMENT_VALUE_KEY:

      property = state.editingbuffer[action.property] || {};
      value    = property[action.key];
      v = {};

      v[action.key] = Math.max(action.min || value + action.amount, value + action.amount);
            
      const nobj = Object.assign({}, state.editingbuffer[action.property] || {}, v);
      
      return Object.assign({}, state, {
          editingbuffer : Object.assign({}, state.editingbuffer, {[action.property]:nobj}),
       })
      

      return state;

    case ActionType.NODE_UPDATE_VALUE_KEY:
      //do some magic with the acuon value too - if array etc.
      
      property = state.editingbuffer[action.property] || {};
      value    = property[action.key];


      if (value != undefined){
        v = {};
    
        if (value.constructor === Array){
            v[action.key] = toggleItem(value, action.value);
        }else{
             v[action.key] = action.value;
        }

        const newobject = Object.assign({}, state.editingbuffer[action.property] || {}, v);

        return Object.assign({}, state, {
          editingbuffer : Object.assign({}, state.editingbuffer, {[action.property]:newobject}),
        })
      }
    
      return state;

	  default:
	    return state;
  }
}
