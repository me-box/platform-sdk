import { MOUSE_MOVE, MOUSE_UP, MOUSE_SCROLL } from '../constants/ActionTypes';
import { MOUSE_X_OFFSET, MOUSE_Y_OFFSET, TOOLBAR_HEIGHT} from '../constants/ViewConstants';

export function mouseMove(x,y){
	return function(dispatch, getState){
    	dispatch({
      				type: MOUSE_MOVE,
      				x:x + MOUSE_X_OFFSET,
     				y:y + MOUSE_Y_OFFSET + getState().mouse.top,
     	});
    }
}

export function mouseUp(){
    return {
      type: MOUSE_UP,
    }
}

export function scroll(top){
	return {
		type: MOUSE_SCROLL,
		top
	}
}