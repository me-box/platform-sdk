import * as Action from './constants';
import {updateNode, updateNodeValueKey, initNodeKeys}  from '../../actions/NodeActions';
import moment from 'moment';


const multiplier = { 's': 1, 'm': 60, 'h': 60*60};

function crontab(state){

	if (state.repeatOption === "interval-time"){
		return `*/${state.intervalFrequency} ${state.intervalStart}-${state.intervalEnd-1} * * ${state.intervalOn.join(",")}`
	}

	else if (state.repeatOption === "time"){
		const [h,m] = state.specificTime.split(":");
		return `${m} ${h} * * ${state.specificTimeOn.join(",")}`;
	}

	return "";
}

//this will change the multiplier for the 'repeat' value 
export function updateRepeatUnits(id, event){
	

	return function (dispatch, getState) {
		
		dispatch({
			type: Action.REPEAT_UNITS_CHANGED,
			units: event.target.value,
			id,
		})

		dispatch(updateNode('repeat', getState()[id].repeat * multiplier[getState()[id]['units']]));
	}

}

//increment/decrement the 'repeat' value
export function incrementRepeat(id, options){
	return function (dispatch, getState) {

		dispatch({
			type: Action.REPEAT_INCREMENT,
			min: options.min,
			max: options.max,
			amount: options.amount,
			id,
		})
		
		dispatch(updateNode('repeat', getState()[id].repeat * multiplier[getState()[id]['units']]));
	}
}

//crontab

export function updateTimeIntervalFrequency(id, event){
	
	return function (dispatch, getState) {
		dispatch({
			type: Action.INTERVAL_FREQUENCY,
			id,
			frequency: event.target.value,
		});

		dispatch(updateNode('crontab', crontab(getState()[id])))
	}
}


export function updateTimeIntervalStart(id, event){
	
	return function (dispatch, getState) {
		dispatch({
			type: Action.INTERVAL_START,
			id,
			start: event.target.value,
		});

		dispatch(updateNode('crontab', crontab(getState()[id])));
	}
}

export function updateTimeIntervalEnd(id, event){
	return function (dispatch, getState) {
		dispatch({
			type: Action.INTERVAL_END,
			id,
			end: event.target.value,
		});

		dispatch(updateNode('crontab', crontab(getState()[id])));
	}
}


export function updateTimeIntervalOn(id,event){

	return function (dispatch, getState) {
		dispatch({
			type: Action.INTERVAL_ON,
			id,
			on: event.target.value,
		});

		dispatch(updateNode('crontab', crontab(getState()[id])));
	}
}


export function updateOnce(id, event){

	return function (dispatch, getState) {
		dispatch({
			type: Action.ONCE,
			id,
			once: event.target.checked,
		});
		dispatch(updateNode('once', getState()[id].once));
	}
}

/* this is a thunk, because we need to dispatch two actions and one is dependent upon the result of the other 
the first updates an internal representation of a time intervale (i.e an integer), the second dispatches an update to the
editing buffer with the string representation */

export function incrementSpecificTime(id, value){
	
	return function (dispatch, getState) {

		let [hour, minute] = (getState()[id].specificTime || "12:00").split(":");
	
		dispatch({
			type: Action.SPECIFIC_TIME,	
			value: moment({hour: hour, minute: minute}).add({hours:value, minutes:value}).format('HH:mm'),
			id,
		})
		
		//this is where we update the crontab property for the editing buffer
		dispatch(updateNode('crontab', crontab(getState()[id])));
	}
}


export function updateSpecificTimeOn(id, event){
	return function (dispatch, getState) {
		dispatch({
			type: Action.SPECIFIC_TIME_ON,
			id,
			on: event.target.value,
		});

		dispatch(updateNode('crontab', crontab(getState()[id])));
	}
}

//and heer
export function repeatOptionChanged(id,value){
	return function (dispatch, getState) {
		dispatch({
			type: Action.REPEAT_OPTION_CHANGED,
    		value,
    		id,
		});
		
		//set the defaults here and remove the current defaults! - in the editing buffer!!
		dispatch(initNodeKeys(Action.REPEAT_DEFAULT_OBJECTS[getState()[id].repeatOption]));
	}
}

export function selectPayloadType(id, payloadType){
	return function (dispatch, getState) {

		dispatch ({
	    	type: Action.PAYLOAD_TYPE_SELECTED,
	    	payloadType,
	    	id
	  	});

	  	dispatch(updateNode('payloadType', getState()[id].payloadType));
	}
}

export function updatePayload(id, event){
	
	return function (dispatch, getState) {

		dispatch ({
	    	type: Action.PAYLOAD,
	    	payload: event.target.value,
	    	id
	  	});

	  	dispatch(updateNode('payload', getState()[id].payload));
	}

};


export function togglePayloadMenu(id){
	return {
    	type: Action.TOGGLE_PAYLOAD_MENU,
  		id
  	}
}

export function toggleBoolMenu(id){
	return {
    	type: Action.TOGGLE_BOOL_MENU,
  		id
  	}
}

export function selectBool(id, value){
	return {
    	type: Action.BOOL_SELECTED,
  		value,
  		id
  	}
}



