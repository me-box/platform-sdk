import {DIALOGUE_OK, DIALOGUE_CANCEL} from '../constants/ActionTypes';
 

export function ok(){
    console.log("ok was clicekd!");
    return {
      type: DIALOGUE_OK,
    }
} 

export function cancel(){
    return {
      type: DIALOGUE_CANCEL,
    }
}