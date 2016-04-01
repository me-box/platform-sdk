import { REQUEST_NODES, RECEIVE_NODES } from '../constants/ActionTypes';

export default function nodes(state = {isFetching:false, didInvalidate:false, nodes:[]}, action) {
  switch (action.type) {
	  
	  case  REQUEST_NODES:
	    return Object.assign({}, state, {
        	isFetching: true,
        	didInvalidate: false
      	})
	  
	  case RECEIVE_NODES:
	  	return Object.assign({}, state, {
        	isFetching: false,
        	didInvalidate: false,
        	nodes: action.nodes,
        	lastUpdated: action.receivedAt
      	})

	  default:
	    return state;
  }
}
