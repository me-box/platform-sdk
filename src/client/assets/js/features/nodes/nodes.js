import {actionConstants as nodeActionTypes} from './constants';
import { createStructuredSelector } from 'reselect';
import { NODE_WIDTH } from 'constants/ViewConstants';
import {actionConstants as portActionTypes} from "features/ports/constants";
export const NAME = 'nodes';

const {LINK_SELECTED} = portActionTypes;
const FOREIGN_MOUSE_UP =  'iot.red/mouse/MOUSE_UP';

function _configureNode(current, changes){
  
  let _n = Object.assign({}, current, changes);

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

const initialState = {
  nodes:[], 
  nodesById: {},
  configsById: {},
  draggingNode: null, 
  selectedId: null, 
  configuringId: null, 
  buffer: {},
}

export default function reducer(state = initialState, action) {
  
  let property, value, v;


  switch (action.type) {  

    case nodeActionTypes.RECEIVE_FLOWS:

        return Object.assign({}, state, {
          nodes: action.nodes.map((node)=>node.id),
          nodesById: action.nodes.reduce((acc, item)=>{
            acc[item.id] = item;
            return acc;
          },{})
        })

    case nodeActionTypes.NODE_CLEAR_ALL:{
        return Object.assign({}, state, initialState);
    }

    case nodeActionTypes.NODE_DROPPED:
        return Object.assign({}, state, {
          nodes: [  ...state.nodes, action.node.id],
          nodesById: Object.assign({}, state.nodesById, {[action.node.id]:action.node}),
          configsById: Object.assign({}, state.configsById, {[action.node.id]:{
                                                                                fn: action.config.fn,
                                                                                id: action.config.id,
                                                                              }
                                                                            }),
        })

    case nodeActionTypes.NODE_MOUSE_DOWN:
      
      return Object.assign({}, state, {
        draggingNode: action.id,
        selectedId: action.id,
      })
    
    case nodeActionTypes.NODE_DOUBLE_CLICKED:
     
      return Object.assign({}, state, {
        draggingNode: null,
        selectedId: action.id,
        configuringId: action.id,
      })
   
     
    case LINK_SELECTED:
    case nodeActionTypes.NODE_DESELECTED:
    case FOREIGN_MOUSE_UP:
    	return Object.assign({}, state, {
    		selectedId: null,
    	});
    
    //called from features/tabs
    case nodeActionTypes.TAB_DELETE:

        return Object.assign({}, state, {
            nodes: state.nodes.filter((id)=>{
                const node = state.nodesById[id];
                return node.z != action.id;
            }),
            nodesById: Object.keys(state.nodesById).reduce((acc,key)=>{
                const node = state.nodesById[key];
                if (action.id != node.z){
                   acc[key] = node;
                }
                return acc;
            },{})
      	});

    case nodeActionTypes.NODE_DELETE:
      
     
      if (!state.selectedId){
          return state;
      }
      return Object.assign({}, state, {
          nodes: state.nodes.filter(item => state.selectedId != item),
          nodesById: Object.keys(state.nodesById).reduce((acc, key)=>{
                if (key != state.selectedId){
                    acc[key] = state.nodesById[key];
                }
                return acc;
          },{}),
          selectedId:null
      });

	   //set up the editing buffer by copying all saved properties from defaults into it.
	  case nodeActionTypes.NODE_CONFIGURE:
		    const defaults = state.nodesById[action.id]._def.defaults || {};
		    const values = Object.keys(defaults).reduce((acc, key)=>{
			     acc[key] = state.nodesById[state.selectedId][key];
           //state.selected[key];
			     return acc;
		    },{});
	
	     return Object.assign({}, state, {buffer: values});
		
    case nodeActionTypes.NODE_INIT_VALUES:
     
      return Object.assign({}, state, {
        buffer : Object.assign({}, state.buffer, action.keys)
      })


    case nodeActionTypes.NODE_UPDATE_VALUE:
   
      
      return Object.assign({}, state, {
        buffer : Object.assign({}, state.buffer, {[action.property]:action.value})
      })
  

    case nodeActionTypes.NODE_INCREMENT_VALUE_KEY:

      property = state.buffer[action.property] || {};
      value    = property[action.key];
      v = {};

      v[action.key] = Math.max(action.min || value + action.amount, value + action.amount);
            
      const nobj = Object.assign({}, state.buffer[action.property] || {}, v);
      
      return Object.assign({}, state, {
          buffer : Object.assign({}, state.buffer, {[action.property]:nobj}),
       })
      

      return state;

    case nodeActionTypes.NODE_UPDATE_VALUE_KEY:
      //do some magic with the acuon value too - if array etc.
      
      property = state.buffer[action.property] || {};
      value    = property[action.key];


      if (value != undefined){
        v = {};
    
        if (value.constructor === Array){
            v[action.key] = toggleItem(value, action.value);
        }else{
             v[action.key] = action.value;
        }

        const newobject = Object.assign({}, state.buffer[action.property] || {}, v);

        return Object.assign({}, state, {
          buffer : Object.assign({}, state.buffer, {[action.property]:newobject}),
        })
      }
    
      return state;

    case nodeActionTypes.NODE_CONFIGURE_CANCEL:
        return Object.assign({}, state, {
          configuringId: null,
          buffer: {},
        })
    
    //set the values in current node to values in buffer
    case nodeActionTypes.NODE_CONFIGURE_OK:
        if (state.configuringId){
          return Object.assign({}, state, {
            configuringId: null,
            buffer: {},
            nodesById: Object.assign({}, state.nodesById, {[state.configuringId]: _configureNode(state.nodesById[state.configuringId], state.buffer)}),
          });
        }
        return state;

    case nodeActionTypes.MOUSE_UP:
      return Object.assign({}, state, {
        draggingNode: null,
      });
    
    case nodeActionTypes.MOUSE_MOVE:

      if (state.draggingNode != null){
        return Object.assign({}, state, {
            nodesById: Object.assign({}, state.nodesById, {[state.draggingNode]: Object.assign({}, state.nodesById[state.draggingNode], {x:action.x, y:action.y})})
        });
      }
      return state;
    
    case nodeActionTypes.NODE_UPDATE_SCHEMA:
    
      return Object.assign({}, state, {
                nodesById : Object.assign({}, state.nodesById, {
                  [action.id]: Object.assign({}, state.nodesById[action.id], {schema:action.schema})
                })
            });

    case nodeActionTypes.NODE_UPDATE_DESCRIPTION:
    
      return Object.assign({}, state, {
                nodesById : Object.assign({}, state.nodesById, {
                  [action.id]: Object.assign({}, state.nodesById[action.id], {description:action.description})
                })
            });

	  default:
	    return state;
  }
}

const nodes = (state)=>state[NAME];
const selectedId = (state)=>state[NAME].selectedId;
const configuringId = (state)=>state[NAME].configuringId;
const node = (state, ownProps)=>state[NAME].nodesById[ownProps.id];
const buffer = (state)=>state[NAME].buffer;

export const selector = createStructuredSelector({
  nodes,
  selectedId,
  configuringId,
  node,
  buffer,
});