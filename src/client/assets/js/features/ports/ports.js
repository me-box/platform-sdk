import { createStructuredSelector } from 'reselect';
import {OUTPUT_WIDTH} from 'constants/ViewConstants';

const LINK_SELECTED  	= 'iot.red/ports/LINK_SELECTED';
const LINK_DESELECTED  	= 'iot.red/ports/LINK_DESELECTED';
const TAB_DELETE  		= 'iot.red/ports/TAB_DELETE';
const DELETE_LINK  		= 'iot.red/ports/DELETE_LINK';
const DELETE_NODE  		= 'iot.red/ports/DELETE_NODE';
const RECEIVE_FLOWS  	= 'iot.red/ports/RECEIVE_FLOWS';
const CLEAR_LINKS		= 'iot.red/ports/CLEAR_LINKS';
const PORT_MOUSE_OVER  	= 'iot.red/ports/PORT_MOUSE_OVER';
const PORT_MOUSE_DOWN  	= 'iot.red/ports/PORT_MOUSE_DOWN';
const MOUSE_UP  		= 'iot.red/ports/MOUSE_UP';
const MOUSE_MOVE 		= 'iot.red/ports/MOUSE_MOVE';

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

		case LINK_SELECTED:
			return Object.assign({}, state, {selectedId: action.id});
		
		case LINK_DESELECTED:
			return Object.assign({}, state, {selectedId: null});
		
		case TAB_DELETE:
		
			return Object.assign({}, state, {
				links: links.nodes.filter((id)=>{
                	const link = state.linksById[id];
                	return (link.source.z !== action.id && link.target.z !== action.id);
            	}),
            	linksById: Object.keys(state.linksById).reduce((acc,key)=>{
                	const link = state.linksById[id];
                	if  (link.source.z !== action.id && link.target.z !== action.id){
                   		acc[key] = link;
                	}
                	return acc;
            	},{})
			});

		case CLEAR_LINKS:
			return Object.assign({}, state, initialState);

		case DELETE_LINK:
			
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
            
            	
		case DELETE_NODE:
      	
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
     	 	

      	
		case RECEIVE_FLOWS:

			return Object.assign({}, state, {
            	links: action.links.map((link)=>link.id),
            	linksById: action.links.reduce((acc, item)=>{
              		acc[item.id] = item;
              		return acc;
            	},{})
        	})
      
		case PORT_MOUSE_OVER:
			
			if (state.output && (state.output.node.id != action.node.id) && action.portIndex == 0){
				
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

		case PORT_MOUSE_DOWN:
			
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

	    case MOUSE_UP:
	    	return Object.assign({}, state, {
	    		output: null
	    	})

	    case MOUSE_MOVE:
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

    	default:
    		return state;
    }
}


function linkSelected(link){
	return function (dispatch, getState) {
		dispatch({
			type: LINK_SELECTED,
			link,
		});
		//dispatch(nodeActions.nodeDeselected());
	}	
}

function portMouseDown(node,portType,portIndex,e){
	
    return {
      type: PORT_MOUSE_DOWN,
      node,
      portType,
      portIndex,
    }
} 

function portMouseOver(node,portType,portIndex,e){
 	 
    return {
      type: PORT_MOUSE_OVER,
      node,
      portType,
      portIndex,
    }
} 

function linkDeselected(){
  return {
      type: LINK_DESELECTED,
  }
}

function linkDelete(link){
	return {
		type: DELETE_LINK,
		link
	}
}

function clearLinks(){
	return {
		type: CLEAR_LINKS,
	}
}

function nodeDelete(node){
	return {
		type: DELETE_NODE,
		node
	}
}

function mouseMove(x,y){
  console.log("ports seen mouse move!");
  return {
     type: MOUSE_MOVE,
     x,
     y,
  }
}

function mouseUp(){
    return {
      type: MOUSE_UP,
    }
}

function deleteTab(id){
    return {
        type: TAB_DELETE,
        id
    }
}

function receiveFlows(links){
  return {
      type: RECEIVE_FLOWS,
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
  linkDeselected,
  linkDelete,
  clearLinks,
  nodeDelete,
  portMouseDown,
  portMouseOver,
  mouseMove,
  mouseUp,
  deleteTab,
  receiveFlows,
};
