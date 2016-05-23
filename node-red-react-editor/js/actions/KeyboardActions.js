import { DELETE_PRESSED, DELETE_PORT } from '../constants/ActionTypes';

export function deletePressed() {

  return function(dispatch, getState) {
      
      const selected = getState().nodes.selected;

      if (selected){
        dispatch({
           type: DELETE_PRESSED
        })


        dispatch({
            type: DELETE_PORT,
            selected: selected
        })
      }
   
  };
}

