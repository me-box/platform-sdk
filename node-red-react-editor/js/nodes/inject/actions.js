import { INTERVAL_CHANGED, UNITS_CHANGED, TIMEINTERVAL_UNITS_CHANGED, TOGGLE_PAYLOAD_MENU, TOGGLE_BOOL_MENU, PAYLOAD_SELECTED, BOOL_SELECTED } from './constants';

export function intervalChanged(id,event){

  return {
    type: INTERVAL_CHANGED,
    value:event.target.value,
    id
  }
}

export function unitsChanged(id,event){
  return {
    type: UNITS_CHANGED,
    value:event.target.value,
    id
  }
}
export function selectPayload(id, payload){
	
	return {
    type: PAYLOAD_SELECTED,
    payload,
    id
  }
}

export function timeIntervalUnitsChanged(id,event){
  return {
    type: TIMEINTERVAL_UNITS_CHANGED,
    value:event.target.value,
    id
  }
}

export function togglePayloadMenu(id){
  return {
    type: TOGGLE_PAYLOAD_MENU,
  	id
  }
}

export function toggleBoolMenu(id){
	return {
    	type: TOGGLE_BOOL_MENU,
  		id
  	}
}

export function selectBool(id, value){
	return {
    	type: BOOL_SELECTED,
  		value,
  		id
  	}
}



