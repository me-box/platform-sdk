import { MOUSE_MOVE } from '../constants/ActionTypes';

export default function mouse(state = {x:0, y:0}, action) {

	switch (action.type) {
		case  MOUSE_MOVE:
	    	return Object.assign({}, state, {
        		x: action.x,
        		y: action.y,
    		})

    	default:
    		return state;
    }
}