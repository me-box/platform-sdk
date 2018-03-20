import { createStructuredSelector } from 'reselect';
import { MOUSE_X_OFFSET, MOUSE_Y_OFFSET} from 'constants/ViewConstants';
import {actionCreators as nodeActions} from 'features/nodes/actions';
import {actionCreators as portActions} from 'features/ports';
import {debounce} from 'utils/utils';

const MOUSE_MOVE = 'iot.red/mouse/MOUSE_MOVE';
const MOUSE_SCROLL =  'iot.red/mouse/MOUSE_SCROLL';
const MOUSE_UP =  'iot.red/mouse/MOUSE_UP';
const MOUSE_DOWN =  'iot.red/mouse/MOUSE_DOWN';

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
        //ignore mouse move if configuring a node, we're not interested in what happens here
        if (getState().nodes.configuringId == null){
          const x = x0 + MOUSE_X_OFFSET;
          const y = y0 + MOUSE_Y_OFFSET + getState().mouse.top;
          dispatch(nodeActions.mouseMove(x,y));
          dispatch(portActions.mouseMove(x,y));
        }
    }
}

//better that it just dispatches single event that reducers listen on!

export function mouseDown(){
  return {
      type: MOUSE_DOWN,
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
  mouseDown,
  scroll,
};