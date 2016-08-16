import {WINDOW_RESIZED} from '../constants/ActionTypes';


function _initialDimensions(){
  return {
    w : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
  }
}

export default function screen(state = {dimensions:_initialDimensions()}, action) {
  switch (action.type) {

  	case  WINDOW_RESIZED:
	    return Object.assign({}, state, {
        	dimensions: {w:action.w, h: action.h}
      })
      
	  default:
	    return state;
  }
}