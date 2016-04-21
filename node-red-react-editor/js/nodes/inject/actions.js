import { INTERVAL_CHANGED, UNITS_CHANGED, TIMEINTERVAL_UNITS_CHANGED } from './constants';

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

export function timeIntervalUnitsChanged(id,event){
  return {
    type: TIMEINTERVAL_UNITS_CHANGED,
    value:event.target.value,
    id
  }
}