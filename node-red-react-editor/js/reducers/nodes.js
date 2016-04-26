import { REQUEST_NODES, RECEIVE_NODES, NODE_DROPPED, NODE_UPDATE_VALUE, NODE_INIT_VALUES,NODE_UPDATE_VALUE_KEY, NODE_MOUSE_DOWN, NODE_DOUBLE_CLICKED,  DIALOGUE_OK, DIALOGUE_CANCEL, NODE_MOUSE_ENTER, NODE_MOUSE_LEAVE, MOUSE_UP, MOUSE_MOVE} from '../constants/ActionTypes';
import { NODE_WIDTH, NODE_HEIGHT, GRID_SIZE} from '../constants/ViewConstants';
import {calculateTextWidth, toggleItem} from '../utils/utils';


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
                            action.node,
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

    case NODE_INIT_VALUES:
     
      return Object.assign({}, state, {
        editingbuffer : {[action.property]:action.value}
      })
    
      return state;


    case NODE_UPDATE_VALUE:
      //handle array case here too?
      return Object.assign({}, state, {
        editingbuffer : Object.assign({}, state.editingbuffer, {[action.property]:action.value})
      })
    
      return state;

    
    case NODE_UPDATE_VALUE_KEY:
      //do some magic with the acuon value too - if array etc.
      
      const property = state.editingbuffer[action.property] || {};
      const value    = property[action.key];
      let v = {};

      if (value){
         if (value.constructor === Array){
          v[action.key] = toggleItem(value, action.value);
         }else{
           v[action.key] = action.value;
         }
      }

      console.log("ok trying an assign of ");
      console.log(state.editingbuffer[action.property]);
      console.log("key " + property);
      console.log("and");
      console.log(v);

      const newobject = Object.assign({}, state.editingbuffer[action.property] || {}, v);
      console.log("and got");
      console.log(newobject);

      return Object.assign({}, state, {
        editingbuffer : Object.assign({}, state.editingbuffer, {[action.property]:newobject}),
      })
    
      return state;

	  default:
	    return state;
  }
}
