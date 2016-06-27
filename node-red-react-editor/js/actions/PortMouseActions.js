import {PORT_MOUSE_DOWN, LINK_SELECTED, PORT_MOUSE_UP, PORT_MOUSE_OVER, PORT_MOUSE_OUT, NODE_DESELECTED} from '../constants/ActionTypes';


export function linkSelected(link){
	return function (dispatch, getState) {
		dispatch({
			type: LINK_SELECTED,
			link,
		});
		dispatch({
			type: NODE_DESELECTED,
		});
	}	
}

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
