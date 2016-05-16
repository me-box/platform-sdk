

import * as Constants from './constants';
import nodes from '../../reducers/nodes';
import {toggleItem} from '../../utils/utils';

export function reducer(state = {
									//internal node state
									payloadType: 'date',
									payload: '',
									
									units: 's',
									repeat: 1,
											
									intervalFrequency: 1,
									intervalStart: 0,
									intervalEnd:1,
									intervalOn: [],

									specificTime: '',
									specificTimeOn: [],
									//view state
									payloadMenu:false, 
									boolMenu: false, 
									selectedBool:'true', 
									repeatOption: 'none',
								}, action){
	

	 switch (action.type) {
	 	
	 	case Constants.REPEAT_UNITS_CHANGED:

	 		return Object.assign({}, state, {
	    										units:action.units,
	    										boolMenu: false,
	    									})

	 	case Constants.REPEAT_INCREMENT:

	 		return Object.assign({}, state, {
	    										repeat: Math.max(action.min || state.repeat + action.amount, state.repeat + action.amount),
	    										boolMenu: false,
	    									})
	    	  	
	  	
	  	case Constants.REPEAT_OPTION_CHANGED:
	    	return Object.assign({}, state, {
	    										repeatOption:action.value,
	    										boolMenu: false,
	    									})


	    case Constants.INTERVAL_FREQUENCY:
	    	return Object.assign({}, state, {
	    										intervalFrequency:action.frequency,
	    										boolMenu: false,
	    									})

	    case Constants.INTERVAL_START:
	    	return Object.assign({}, state, {
	    										intervalStart:action.start,
	    										boolMenu: false,
	    									})

	    case Constants.INTERVAL_END:
			return Object.assign({}, state, {
	    										intervalEnd:action.end,
	    										boolMenu: false,
	    									})

		case Constants.INTERVAL_ON:

			return Object.assign({}, state, {
	    										intervalOn:toggleItem(state.intervalOn, action.on),
	    										boolMenu: false,
	    									})

		case Constants.SPECIFIC_TIME:
			
			return Object.assign({}, state, {
	    										specificTime: action.value,
	    										boolMenu: false,
	    									})

		case Constants.SPECIFIC_TIME_ON:
			return Object.assign({}, state, {
	    										specificTimeOn:toggleItem(state.specificTimeOn, action.on),
	    										boolMenu: false,
	    									})


	  	case Constants.TOGGLE_PAYLOAD_MENU:

	    	return Object.assign({}, state, {
	    										payloadMenu:!state.payloadMenu,
	    										boolMenu: false,
	    									})
	  	
	  	case Constants.TOGGLE_BOOL_MENU:
	    	return Object.assign({}, state, {
	    										boolMenu:!state.boolMenu,
	    									})

	  	case Constants.PAYLOAD_TYPE_SELECTED:
	    	return Object.assign({}, state, {
	    										payloadType:action.payloadType,
	    										payloadMenu: false,
	    										boolMenu: false,
	    									})

	    case Constants.PAYLOAD:
	    	return Object.assign({}, state, {
	    										payload:action.payload,
	    										payloadMenu: false,
	    										boolMenu: false,
	    									})

	    case Constants.BOOL_SELECTED:
	    	return Object.assign({}, state, {
	    										boolMenu: false,
	    										payloadMenu: false,
	    										selectedBool: action.value,
	    									})


	  	default:
	    	return state;
  	}
}