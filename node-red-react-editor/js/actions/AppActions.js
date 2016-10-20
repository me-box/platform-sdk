import { DEBUG_MESSAGE } from '../constants/ActionTypes';

export function redMessage(msg) {
  //const {id, name, view, data} = msg;
 

  return {
    type: DEBUG_MESSAGE,
    /*policy: view === "list" ? "replace" : "append", 
    id,
    name,
    view,
    data*/
  }
}