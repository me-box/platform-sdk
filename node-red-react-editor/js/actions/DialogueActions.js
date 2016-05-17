import {DIALOGUE_OK, DIALOGUE_CANCEL, NODE_LOAD} from '../constants/ActionTypes';
 
export function nodeLoad(node){
  console.log("firing a node load!!");
  console.log(node);
  return {
    type: NODE_LOAD,
    node,
    id: node.id,
  }
}
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