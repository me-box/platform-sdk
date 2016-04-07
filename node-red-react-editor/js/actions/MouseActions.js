import { MOUSE_MOVE, MOUSE_UP } from '../constants/ActionTypes';

export function mouseMove(x,y){
	//console.log(`${x},${y}`);
    return {
      type: MOUSE_MOVE,
      x:x-180,
      y:y-35,
    }
}

export function mouseUp(){
    return {
      type: MOUSE_UP,
    }
}