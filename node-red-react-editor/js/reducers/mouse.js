import { MOUSE_MOVE, MOUSE_SCROLL } from '../constants/ActionTypes';

export default function mouse(state = {x:0, y:0, top:0}, action) {

	switch (action.type) {
		case  MOUSE_MOVE:
	    	return Object.assign({}, state, {
        		x: action.x,
        		y: action.y,
    		});

		case  MOUSE_SCROLL:
			return Object.assign({}, state, {
        		top: action.top,
    		});
    		
    	default:
    		return state;
    }
}