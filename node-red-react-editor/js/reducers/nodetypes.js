import {REQUEST_NODES, RECEIVE_NODES} from '../constants/ActionTypes';


function _categorise(nodes){
	return nodes.reduce((acc, node) => {
		
		acc[node.def.category] = acc[node.def.category] || [];
		acc[node.def.category].push(node);
		return acc;
	},{});
}

export default function types(state = {isFetching:false, didInvalidate: false, nodetypes:[], categories:{}}, action) {
  switch (action.type) {

  	case  REQUEST_NODES:
	    return Object.assign({}, state, {
        	isFetching: true,
        	didInvalidate: false
      	})
	  
    //called when all of the node types have been recieved!
    case RECEIVE_NODES:
      	return Object.assign({}, state, {
      		isFetching: false,
        	didInvalidate: false,
        	nodetypes: action.nodes,
        	categories: _categorise(action.nodes),
      	});
      
	default:
	    return state;
  }
}