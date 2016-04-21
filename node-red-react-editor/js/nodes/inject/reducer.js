import {INTERVAL_CHANGED, UNITS_CHANGED, TIMEINTERVAL_UNITS_CHANGED} from './constants';

export function reducer(state = {repeatOption:'none', units:'s', timeintervalunits:1}, action){

	 switch (action.type) {
	 	
	 	case INTERVAL_CHANGED:
	    	return Object.assign({}, state, {repeatOption:action.value})

	    case UNITS_CHANGED:
	    	return Object.assign({}, state, {units:action.value})
	  	
	  	case TIMEINTERVAL_UNITS_CHANGED:
	    	return Object.assign({}, state, {timeintervalunits:action.value})
	  	
	  	default:
	    	return state;
  	}
}