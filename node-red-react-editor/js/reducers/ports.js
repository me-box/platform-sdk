import { MOUSE_UP, PORT_MOUSE_DOWN, PORT_MOUSE_OVER, PORT_MOUSE_OUT, MOUSE_MOVE } from '../constants/ActionTypes';
import {NODE_WIDTH, NODE_HEIGHT, OUTPUT_WIDTH} from '../constants/ViewConstants';

export default function ports(state = {drawingPort:null, activeLink:{from:{x:0,y:0}, to:{x:0,y:0}}, links:[], offset:{x:0, y:0}}, action) {

	switch (action.type) {

		case PORT_MOUSE_OVER:
			
			if (state.drawingPort && (state.drawingPort.id != action.node.id) && action.portIndex == 0){
				return Object.assign({}, state, {
            		links: [  
            					...state.links,
                            	{
                            		from: state.drawingPort,
                            	 	to: action.node,
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
		    						from: {	
		    								x: OUTPUT_WIDTH,
		    								y: 0,
										  },

		    						to: {
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