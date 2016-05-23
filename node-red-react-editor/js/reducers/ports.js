import { RECEIVE_FLOWS, DELETE_PORT, MOUSE_UP, PORT_MOUSE_DOWN, PORT_MOUSE_OVER, PORT_MOUSE_OUT, MOUSE_MOVE } from '../constants/ActionTypes';
import {NODE_WIDTH, NODE_HEIGHT, OUTPUT_WIDTH} from '../constants/ViewConstants';

export default function ports(state = {drawingPort:null, activeLink:{source:{x:0,y:0}, target:{x:0,y:0}}, links:[], offset:{x:0, y:0}}, action) {

	switch (action.type) {

		case DELETE_PORT:
      		return Object.assign({}, state, {
            	links: state.links.filter(link => {
            		if (action.selected && (link.source.id === action.selected.id || link.target.id === action.selected.id))
            			return false;
            		return true;
            	})
     	 	});

		case RECEIVE_FLOWS:
        	return Object.assign({}, state, {
            	links: action.links,
        	})

		case PORT_MOUSE_OVER:
			
			if (state.drawingPort && (state.drawingPort.id != action.node.id) && action.portIndex == 0){
				return Object.assign({}, state, {
            		links: [  
            					...state.links,
                            	{
                            		sourcePort: action.portIndex,
                            		source: state.drawingPort,
                            	 	target: action.node,
                            	},
                           ],
                    drawingPort: null,
        		})
			}
			return state;

		case PORT_MOUSE_DOWN:
	    	return Object.assign({}, state, {
	    		drawingPort: action.node,
	    		offset: {x: action.node.x+(action.node.w/2), y: action.node.y},
	    		
	    	})

	    case MOUSE_UP:
	    	return Object.assign({}, state, {
	    		drawingPort: null
	    	})

	    case MOUSE_MOVE:
	    	if (state.drawingPort){
		    	return Object.assign({}, state, {
		    		activeLink: {
		    						//need a soruce port!

		    						source: {	
		    								x: OUTPUT_WIDTH,
		    								y: 0,
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