import { createStructuredSelector } from 'reselect';

const WINDOW_RESIZED  = 'iot.red/screen/WINDOW_RESIZED';

export const NAME = 'screen';

const initialState = {
    dimensions: {
          w : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
          h : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
    }
}


export default function screen(state = initialState, action) {
  switch (action.type) {

  	case  WINDOW_RESIZED:
	    return Object.assign({}, state, {
        	dimensions: {w:action.w, h: action.h}
      })
      
	  default:
	    return state;
  }
}

function windowResize(w,h) {
  return {
    type: WINDOW_RESIZED,
    w,
    h
  };
}

const screen = (state) => state[NAME];

export const selector = createStructuredSelector({
  screen
});

export const actionCreators = {
  windowResize
};