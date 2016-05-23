import {PORT_MOUSE_DOWN, PORT_MOUSE_UP, PORT_MOUSE_OVER, PORT_MOUSE_OUT} from '../constants/ActionTypes';

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

export function portMouseOver(node,portType,portIndex,e){
    return {
      type: PORT_MOUSE_OVER,
      node,
      portType,
      portIndex,
    }
} 

export function portMouseOut(node,portType,portIndex,e){
    return {
      type: PORT_MOUSE_OUT,
      node,
      portType,
      portIndex,
    }
} 
