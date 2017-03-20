import {actionCreators as nodeActions} from 'features/nodes';
import {actionCreators as portActions} from 'features/ports';

export function deletePressed() {

  return function(dispatch, getState) {
      
    const node = getState().nodes.selected;
	  const link = getState().ports.selected;
	  
      
  	if (node){
      dispatch(nodeActions.nodeDelete(node));
      dispatch(portActions.nodeDelete(node));
  	}
  	
  	if (link){
  		 dispatch(portActions.linkDelete(link));
  	}
   
  };
}

export const actionCreators = {
  deletePressed,
};