import * as Action from './constants';
import {updateNodeValueKey}  from '../../actions/NodeActions';
import moment from 'moment';


/* this is a reduc think, because we need to dispatch two actions and one is dependent upon the result of the other 
the first updates an internal representation of a time intervale (i.e an integer), the second dispatches an update to the
editing buffer with the string representation */

export function incrementInterval(id, obj){
	
	return function (dispatch, getState) {
		
		dispatch({
			type: Action.INCREMENT_INTERVAL,	
			...obj,
			id,
		})
		const t = getState()[id].timeInterval
		const timestr = moment(({hour: 12, minute: 0})).add({hours:t, minutes:t}).format('HH:mm'); 
		dispatch(updateNodeValueKey(obj.property, obj.key, timestr));
	}
}


export function intervalChanged(id,value){
  	return {
  		type: Action.INTERVAL_CHANGED,
    	value,
    	id
  	}
}

export function selectPayload(id, payload){
	return {
    	type: Action.PAYLOAD_SELECTED,
    	payload,
    	id
  	}
}


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



