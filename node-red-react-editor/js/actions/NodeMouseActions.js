import {NODE_MOUSE_DOWN, NODE_DOUBLE_CLICKED, NODE_CANCEL_CLICKED, NODE_TOUCH_START, NODE_TOUCH_END, NODE_MOUSE_ENTER, NODE_MOUSE_EXIT, NODE_LOAD, LINK_DESELECTED} from '../constants/ActionTypes';
 


export function nodeMouseDown(node, event){
   
   
	return function(dispatch, getState){
	
		dispatch ({
			type: LINK_DESELECTED,
		});
	
		dispatch ({
	  		type: NODE_MOUSE_DOWN,
      		node,
      		event,
		})
	}
} 

export function nodeDoubleClicked(node, event){

  return function (dispatch, getState) {
  
    
    dispatch ({
        type: NODE_DOUBLE_CLICKED,
        node,
        event,
    });
    
    dispatch({
        type: NODE_LOAD,
        node,
        id: node.id
    });
    
    /*dispatch({
    	type: HELP_UPDATE_DESCRIPTION,
    	description: getState().nodes.selected._def.description(),
    });*/
    

  }
} 

export function nodeTouchStart(node, event){
    return {
      type: NODE_TOUCH_START,
      node,
      event,
    }
}

export function nodeTouchEnd(node, event){
    return {
      type: NODE_TOUCH_END,
      node,
      event
    }
}

export function nodeMouseEnter(node, event){
    return {
      type: NODE_MOUSE_ENTER,
      node,
      event
    }
}

export function nodeMouseLeave(node, event){
    return {
      type: NODE_MOUSE_LEAVE,
      node,
      event
    }
}