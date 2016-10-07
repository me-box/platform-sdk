import * as Constants from './constants';
import {toggleItem} from '../../../utils/utils';
import {NODE_LOAD} from '../../../constants/ActionTypes';

const multiplier = { 's': 1, 'm': 60, 'h': 60*60};


function translateToLocalState(node){

	let local = {};

	if (node.repeat && node.repeat != ""){ //node is a standard repeat
		local.units = node.repeat <= 60 ? 's' : node.repeat <= 60*60 ? 'm' : 'h';
		local.repeat = node.repeat / multiplier[local.units];
		local.repeatOption = 'interval';
		local.once = node.once;
		return local;
	}

	if (node.crontab && node.crontab.substring(0,1) === "*"){ //time-interval
		local.repeatOptioj = 'time-interval';
		const [frequency, interval,,,days] = node.crontab.split(/\s+/);
		local.intervalFrequency = frequency.split("\/")[1];
		[local.intervalStart, local.intervalEnd] = interval.split("-");
		local.intervalEnd = `${parseInt(local.intervalEnd) + 1}`;
		local.intervalOn = days.split(",");
		return local;
	}

	if (node.crontab && node.crontab != ""){ //specific time
		const [m,h,,,days] = node.crontab.split(/\s+/);
		local.specificTime = `${h}:${m}`;
		local.specificTimeOn = days.split(",");
		return local;
	}
	
	local.repeatOption = 'none';
	local.once = node.once;

	console.log(local);
	return local;
	
}

export function reducer(state = {
									//internal node state
									payloadType: 'date',
									payload: '',
									
									units: 's',
									repeat: 1,
									once: false,

									intervalFrequency: 1,
									intervalStart: 0,
									intervalEnd:1,
									intervalOn: [],

									specificTime: '',
									specificTimeOn: [],
									//view state
									payloadMenu:false, 
									boolMenu: false, 
									repeatOption: 'none',
								}, action){
	

	 switch (action.type) {
	 	
	 	case NODE_LOAD: //this is where we initialise our values that will be used by the dialogue (i.e convert from node values to our local state)
	 		
	 		return Object.assign({}, state, translateToLocalState(action.node));
	 		
	 	case Constants.ONCE:
	 		return Object.assign({}, state, {
	    										once:action.once,
	    										boolMenu: false,
	    									})

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
	    										payload: action.value,
	    									})

	  	default:
	    	return state;
  	}
}