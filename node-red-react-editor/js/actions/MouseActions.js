import { MOUSE_MOVE, MOUSE_UP } from '../constants/ActionTypes';
import { MOUSE_X_OFFSET, MOUSE_Y_OFFSET, TOOLBAR_HEIGHT} from '../constants/ViewConstants';

export function mouseMove(x,y){
	//console.log(`${x},${y}`);
    return {
      type: MOUSE_MOVE,
      x:x + MOUSE_X_OFFSET,
      y:y + MOUSE_Y_OFFSET,
    }
}

export function mouseUp(){
    return {
      type: MOUSE_UP,
    }
}