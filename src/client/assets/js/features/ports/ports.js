import { createStructuredSelector } from 'reselect';
import {OUTPUT_WIDTH} from 'constants/ViewConstants';
import {actionConstants as portActionTypes} from './constants';
import {actionConstants as nodeActionTypes}from "features/nodes/constants";

const FOREIGN_MOUSE_UP =  'iot.red/mouse/MOUSE_UP';
const FOREIGN_CLEAR = 'iot.red/editor/CLEAR';
const {NODE_MOUSE_DOWN} = nodeActionTypes;

export const NAME = 'ports';

const initialState = {
	output:null, 
	
	selectedId: null, 
	
	activeLink:{
	
		source:{
			x:0,
			y:0
		}, 
		target:{
			x:0,
			y:0
		}
	}, 
	
	links:[], 
	linksById:{},

	offset:{
		x:0, 
		y:0
	}
};

const _flatten = (arr=[])=>{
	return arr.reduce((acc, row)=>{
		if (Array.isArray(row)){
			return row.reduce((acc, src)=>{
				acc.push(src);
					return acc;
			}, acc);
		}
		return [...acc, row];
	}, [])
}

const _dedup = (arr=[])=>{
	let seen = {};
	return arr.filter((item)=>{
		if (seen[item])
			return false;
		seen[item] = true;
		return true;
	});
}

const _leaf = (id, links)=>{
	const item = links.find((item)=>{
		return item.split(":")[1] === id;
	});
	return item ? false : true;
}

const _from = (link)=>{
	return link.split(":")[1]
} 

const _to = (link)=>{
	return link.split(":")[2]
}

const _remove_loops = (links)=>{
	return links.reduce((acc, item)=>{
		if (!(acc.find(i=>_from(i) === _to(item) && _to(i) === _from(item)))){
			acc = [...acc, item];
		}
		return acc;
	},[]);
}

const _children = (id, links)=>{
	if (_leaf(id,links)){
		return [id];
	}
	return [id, ...links.filter((l)=>_from(l) === id).map(link=>[].concat(..._children(_to(link), links)))];
}

const _downstreamnodes = (id, links)=>{
	return [].concat(..._children(id, _remove_loops(links)));
}

const _updatedownstream = (id, dispatch, getState)=>{
			
	const links = getState().ports["links"];

	const downstream = _downstreamnodes(id,links);

	downstream.forEach((n)=>{

		const nodes = getState().nodes.nodesById;
		const node = nodes[n];


		const inputs = links.filter((key)=>{
          	return _to(key) === n;
        }).map((linkId)=>{
          const {id, schema} = nodes[_from(linkId)];
          return {id,schema};
        });

		if (node && node._def.schemakey){
			console.log("downstream node is", node);
			
			const value = node[node._def.schemakey];
			if (value){
				dispatch({
						type: 'iot.red/nodes/NODE_UPDATE_SCHEMA',
						id: n,
						schema: node._def.schemafn(value, node.id, inputs)
				});
			}
		}
		else{
			dispatch({
				type: 'iot.red/nodes/NODE_UPDATE_SCHEMA',
				id: n,
				schema: {},
			});
		}
	});
}

export default function reducer(state = initialState, action) {

	switch (action.type) {

		case portActionTypes.LINK_SELECTED:
			
			return Object.assign({}, state, {selectedId: action.link});
		
		case NODE_MOUSE_DOWN:
			return Object.assign({}, state, {selectedId: null});
		
		case portActionTypes.TAB_DELETE:
		
			return Object.assign({}, state, {
				links: state.links.filter((id)=>{
                	const link = state.linksById[id];
                	return (link.source.z !== action.id && link.target.z !== action.id);
            	}),
            	linksById: Object.keys(state.linksById).reduce((acc,id)=>{
                	const link = state.linksById[id];
                	if  (link.source.z !== action.id && link.target.z !== action.id){
                   		acc[id] = link;
                	}
                	return acc;
            	},{})
			});

		case portActionTypes.CLEAR_LINKS:
			return Object.assign({}, state, initialState);

		case portActionTypes.DELETE_LINK:
			
      		return Object.assign({}, state, {
            	links: state.links.filter((id)=>id != state.selectedId),
            	linksById: Object.keys(state.linksById).reduce((acc,id)=>{
                	if (id != state.selectedId){
                   		acc[id] = state.linksById[id];
                	}
                	return acc;
            	},{}),
            	selectedId: null,
            });
            
            	
		case portActionTypes.DELETE_NODE:
      	
      		return Object.assign({}, state, {
            	links: state.links.filter((id)=>{
                	const link = state.linksById[id];
                	return (link.source.id !== action.node && link.target.id !== action.node);
            	}),
            	linksById: Object.keys(state.linksById).reduce((acc,id)=>{
                	const link = state.linksById[id];
                	if  (link.source.id !== action.node && link.target.id !== action.node){
                   		acc[id] = link;
                	}
                	return acc;
            	},{})
     	 	});
     	 	

      	
		case portActionTypes.RECEIVE_FLOWS:

			return Object.assign({}, state, {
            	links: action.links.map((link)=>link.id),
            	linksById: action.links.reduce((acc, item)=>{
              		acc[item.id] = item;
              		return acc;
            	},{})
        	})
      
		case portActionTypes.PORT_MOUSE_OVER:
			
			if (state.output && (state.output.node.id != action.node.id && action.node.inputs > 0) && action.portIndex == 0){

				const id = `${state.output.sourcePort}:${state.output.node.id}:${action.node.id}:${action.portIndex}`;

				return Object.assign({}, state, {
								            		links: [...state.links, id],
								            		linksById: Object.assign({}, state.linksById, {
								            							[id]:{
								            									id,
								                            					sourcePort: state.output.sourcePort,
								                            					source: state.output.node,
								                            	 				target: {
																			    	id: action.node.id,
																			    	z : action.node.z
																			    },
								                    					}
								                    }),
								                    output: null,
								        		})
			}
			return state;

		case portActionTypes.PORT_MOUSE_DOWN:
			
			const privacy = action.node.schema && action.node.schema.output ? action.node.schema.output.ptype || [] : [];
			
	    	return Object.assign({}, state, {
	    		output: {
    				node: {
				    	id: action.node.id,
				    	z : action.node.z,
				    	privacy,
				    },
    				sourcePort: action.portIndex,
    				portType: action.portType,
	    		},
	    		offset: {x: action.node.x+(action.node.w/2), y: action.node.y},
	    	})

	    case FOREIGN_MOUSE_UP:
	    	return Object.assign({}, state, {
	    		output: null
	    	})

	    case portActionTypes.MOUSE_MOVE:
	    	if (state.output){
		    	return Object.assign({}, state, {
		    		activeLink: {
		    						//need a soruce port!

		    						source: {	
		    								x: OUTPUT_WIDTH-5,
		    								y: -5,
										  },

		    						target: {
		    								x:action.x-state.offset.x,
		    								y:action.y-state.offset.y,
		    							}
		    					}
		    	})
	    	}
	    	return state;


	    case FOREIGN_CLEAR:
	    	return initialState;

    	default:
    		return state;
    }
}


function linkSelected(link){
	
	return function (dispatch, getState) {
		dispatch({
			type: portActionTypes.LINK_SELECTED,
			link,
		});
		//dispatch(nodeActions.nodeDeselected());
	}	
}

function portMouseDown(node,portType,portIndex,e){
	
	return {
     	type: portActionTypes.PORT_MOUSE_DOWN,
      	node,
      	portType,
      	portIndex,
    }
} 

function portMouseOver(node,portType,portIndex,e){
 	
 	return (dispatch, getState)=>{
		if (getState().ports.output){
			
			dispatch({
     	 		type: portActionTypes.PORT_MOUSE_OVER,
      			node,
      			portType,
      			portIndex,
    		});

			_updatedownstream(node.id, dispatch,getState);
		}
	}
} 

function linkDelete(link){
	
	return (dispatch, getState)=>{
		dispatch ({
			type: portActionTypes.DELETE_LINK,
			link
		});
		_updatedownstream(_to(link), dispatch,getState);
	}
}

function clearLinks(){
	return {
		type: portActionTypes.CLEAR_LINKS,
	}
}

function nodeDelete(node){
	return {
		type: portActionTypes.DELETE_NODE,
		node
	}
}

function mouseMove(x,y){
  return {
     type: portActionTypes.MOUSE_MOVE,
     x,
     y,
  }
}

function deleteTab(id){
	
    return {
        type: portActionTypes.TAB_DELETE,
        id
    }
}

function receiveFlows(links){
  return {
      type: portActionTypes.RECEIVE_FLOWS,
      links,
  }
}

const ports = (state) => state[NAME];
const link  = (state, ownProps)=>{
	const link = state[NAME].linksById[ownProps.id];
	return{
		id: link.id,
		source: state.nodes.nodesById[link.source.id],
		target: state.nodes.nodesById[link.target.id],
		sourcePort: link.sourcePort,
	}

}

export const selector = createStructuredSelector({
  ports,
  link,
});

export const actionCreators = {
  linkSelected,
  linkDelete,
  clearLinks,
  nodeDelete,
  portMouseDown,
  portMouseOver,
  mouseMove,
  deleteTab,
  receiveFlows,
};
