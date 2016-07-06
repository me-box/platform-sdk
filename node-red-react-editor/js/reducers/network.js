import {NETWORK_ACCESS, NETWORK_ERROR, NETWORK_SUCCESS, NETWORK_COMPLETE} from '../constants/ActionTypes';

export default function network(state = {status:null, message:null}, action) {
	
	switch (action.type) {
		
		case NETWORK_ACCESS:
			return {status: 'access', message: action.message};
		
		case NETWORK_ERROR:
			return {status: 'error', message: action.err};
			
		case NETWORK_SUCCESS:
			return {status: 'success', message: action.message};
			
		case NETWORK_COMPLETE:
			return {status: null, message: null};
		
		default:
			return state;
			
	}	
	
}
