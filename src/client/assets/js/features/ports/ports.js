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
				
				console.log("TARGET IS", action.node);
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
			
	    	return Object.assign({}, state, {
	    		output: {
    				node: {
				    	id: action.node.id,
				    	z : action.node.z
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
 	 
    return {
      type: portActionTypes.PORT_MOUSE_OVER,
      node,
      portType,
      portIndex,
    }
} 

function linkDelete(link){
	

	return {
		type: portActionTypes.DELETE_LINK,
		link
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
