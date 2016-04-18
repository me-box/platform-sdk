import {DIALOGUE_OK, DIALOGUE_CANCEL} from '../constants/ActionTypes';
 
export function ok(){
    return {
      type: DIALOGUE_OK,
    }
} 

export function cancel(){
    return {
      type: DIALOGUE_CANCEL,
    }
}