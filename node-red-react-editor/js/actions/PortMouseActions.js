import {PORT_MOUSE_DOWN, PORT_MOUSE_UP} from '../constants/ActionTypes';

export function portMouseDown(node,portType,portIndex,e){
    return {
      type: PORT_MOUSE_DOWN,
      node,
      portType,
      portIndex,
    }
} 

export function portMouseUp(node,portType,portIndex,e){
    return {
      type: PORT_MOUSE_UP,
      node,
      portType,
      portIndex,
    }
} 