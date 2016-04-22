import {INTERVAL_CHANGED, UNITS_CHANGED, TIMEINTERVAL_UNITS_CHANGED, TOGGLE_PAYLOAD_MENU, TOGGLE_BOOL_MENU, PAYLOAD_SELECTED, BOOL_SELECTED} from './constants';

export function reducer(state = {repeatOption:'none', units:'s', timeintervalunits:1, payloadMenu:false, boolMenu: false, selectedPayload:'date', selectedBool:'true'}, action){
	 
	 switch (action.type) {
	 	
	 	case INTERVAL_CHANGED:
	    	return Object.assign({}, state, {
	    										repeatOption:action.value,
	    										boolMenu: false,
	    									})

	    case UNITS_CHANGED:
	    	return Object.assign({}, state, {
	    										units:action.value,
	    										boolMenu: false,
	    									})
	  	
	  	case TIMEINTERVAL_UNITS_CHANGED:
	    	return Object.assign({}, state, {
	    										timeintervalunits:action.value,
	    										boolMenu: false,
	    									})
	  	
	  	case TOGGLE_PAYLOAD_MENU:
	    	return Object.assign({}, state, {
	    										payloadMenu:!state.payloadMenu,
	    										boolMenu: false,
	    									})
	  	
	  	case TOGGLE_BOOL_MENU:
	  		console.log("tpggle biil menu!");
	    	return Object.assign({}, state, {
	    										boolMenu:!state.boolMenu,
	    									})

	  	case PAYLOAD_SELECTED:
	    	return Object.assign({}, state, {
	    										selectedPayload:action.payload,
	    										payloadMenu: false,
	    										boolMenu: false,
	    									})

	    case BOOL_SELECTED:
	    	return Object.assign({}, state, {
	    										boolMenu: false,
	    										payloadMenu: false,
	    										selectedBool: action.value,
	    									})


	  	default:
	    	return state;
  	}
}