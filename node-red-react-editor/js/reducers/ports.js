import { MOUSE_UP, PORT_MOUSE_DOWN, MOUSE_MOVE } from '../constants/ActionTypes';
import {NODE_WIDTH, NODE_HEIGHT, OUTPUT_WIDTH} from '../constants/ViewConstants';

export default function ports(state = {drawing:false, activeLink:{from:{x:0,y:0}, to:{x:0,y:0}}, links:[], offset:{x:0, y:0}}, action) {

	switch (action.type) {

		case  PORT_MOUSE_DOWN:

	    	return Object.assign({}, state, {
	    		offset: {x: action.node.x+(NODE_WIDTH/2), y: action.node.y},
	    		drawing: true,
	    	})

	    case MOUSE_UP:
	    	return Object.assign({}, state, {drawing: false})

	    case MOUSE_MOVE:
	    	if (state.drawing){
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