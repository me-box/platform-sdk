import * as ActionType from '../constants/ActionTypes';
import { NODE_WIDTH, GRID_SIZE} from '../constants/ViewConstants';
import {calculateTextWidth, toggleItem} from '../utils/utils';
import {ports} from './ports';

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
  
  //const w = Math.max(NODE_WIDTH,GRID_SIZE*(Math.ceil((calculateTextWidth(_n.label, "node_label", 50)+(_n.inputs>0?7:0))/GRID_SIZE)));
  const w = NODE_WIDTH;
  _n.w = w; 

  return _n;
}

export default function nodes(state = {nodes:[], draggingNode: null, selected: null, configuring: null, editingbuffer: {}}, action) {
  
  let property, value, v;

  switch (action.type) {  

    case ActionType.RECEIVE_FLOWS:
        return Object.assign({}, state, {
            nodes: action.nodes,
        })

    case ActionType.NODE_DROPPED:
       
        return Object.assign({}, state, {
            nodes: [  ...state.nodes,
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
        selected: action.node,
      })
    
    case ActionType.NODE_DOUBLE_CLICKED:
     
      return Object.assign({}, state, {
        draggingNode: null,
        selected: action.node,
        configuring: action.node,
      })
   
    case ActionType.NODE_DESELECTED:
    	return Object.assign({}, state, {
    		selected: null,
    	});
    	
    case ActionType.TAB_DELETE:
        return Object.assign({}, state, {
            nodes: state.nodes.filter(item => action.id !== item.z),
      	});

    case ActionType.DELETE_NODE:

      return Object.assign({}, state, {
            nodes: state.nodes.filter(item => state.selected ? state.selected.id === item.id ? false : true : true),
      });

    case ActionType.MOUSE_MOVE:
      
      if (state.draggingNode != null){

        return Object.assign({}, state, {
            nodes:  state.nodes.map((node)=>{
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
        configuring: null,
        editingbuffer: {},
    })
    
    //set the values in current node to values in editingbuffer
    case ActionType.DIALOGUE_OK:
    	
      return Object.assign({}, state, {
         configuring: null,
         editingbuffer: {},
         nodes: state.nodes.map((node)=>{
          	console.log(`checking ${node.id} against ${state.configuring.id}`); 
          	if (node.id === state.configuring.id){
            	return updateNode(node, state.editingbuffer);
          	}
          	return node;
        })
    })

	//set up the editing buffer by copying all saved properties from defaults into it.
	case ActionType.NODE_LOAD:
		const defaults = action.node._def.defaults || {};
		const values = Object.keys(defaults).reduce((acc, key)=>{
			acc[key] = state.selected[key];
			return acc;
		},{});
		
		
		return Object.assign({}, state, {editingbuffer: values});
		
    case	 ActionType.NODE_INIT_VALUES:
     
      return Object.assign({}, state, {
        editingbuffer : Object.assign({}, state.editingbuffer, action.keys)
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
