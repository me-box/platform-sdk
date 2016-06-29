import { DELETE_NODE, DELETE_LINK} from '../constants/ActionTypes';

export function deletePressed() {

  return function(dispatch, getState) {
      
      const nodeselected = getState().nodes.selected;
	  const linkselected = getState().ports.selected;
	  
      
      
      	if (nodeselected){
      		dispatch({
           		type: DELETE_NODE,
           		node: nodeselected,
        	})
      	}
      	
      	if (linkselected){
      		dispatch({
           		type: DELETE_LINK,
           		link: linkselected,
        	})
      	}
   
  };
}

