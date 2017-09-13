import { createStructuredSelector } from 'reselect';
import { MOUSE_X_OFFSET, MOUSE_Y_OFFSET} from 'constants/ViewConstants';
import {actionCreators as nodeActions} from 'features/nodes/actions';
import {actionCreators as portActions} from 'features/ports';


const MOUSE_MOVE = 'iot.red/mouse/MOUSE_MOVE';
const MOUSE_SCROLL =  'iot.red/mouse/MOUSE_SCROLL';
const MOUSE_UP =  'iot.red/mouse/MOUSE_UP';
export const NAME = 'mouse';

const initialState = {
  x:0,
  y:0,
  top: 0,
}

export default function reducer(state = initialState, action) {
  
  switch (action.type) {
    
    case MOUSE_MOVE:
      return Object.assign({}, state, {x:action.x, y:action.y});

    case MOUSE_SCROLL:
      return Object.assign({}, state, {top:action.top});
    
    default:
      return state;
  }
}


function mouseMove(x0,y0){
    return function(dispatch, getState){
        const x = x0 + MOUSE_X_OFFSET;
        const y = y0 + MOUSE_Y_OFFSET + getState().mouse.top;

        dispatch(nodeActions.mouseMove(x,y));
        dispatch(portActions.mouseMove(x,y));
    }
}

//better that it just dispatches single event that reducers listen on!

export function mouseUp(){
    console.log("mouse -- seen a mouse up");
    return {
      type: MOUSE_UP,
    }
    /*return function(dispatch,getState){
        dispatch(mouseActions.mouseUp());
        //dispatch(portActions.mouseUp());
        //dispatch(testActions.mouseUp());
        //dispatch(repoActions.mouseUp());
    } */
}

export function scroll(top){
    return {
       type: MOUSE_SCROLL,
       top,
    }
}

const mouse = (state) => state[NAME];

export const selector = createStructuredSelector({
  mouse
});

export const actionCreators = {
  mouseMove,
  mouseUp,
  scroll,
};