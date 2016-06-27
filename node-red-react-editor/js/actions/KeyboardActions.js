import { DELETE_PRESSED, DELETE_PORT } from '../constants/ActionTypes';

export function deletePressed() {

  return function(dispatch, getState) {
      
      const nodeselected = getState().nodes.selected;
	  const linkselected = getState().ports.selected;
	  
      if (nodeselected || linkselected){
        dispatch({
           type: DELETE_PRESSED
        })

		if (nodeselected){
        	dispatch({
            	type: DELETE_PORT,
            	selected: nodeselected
        	})
        }
      }
   
  };
}

