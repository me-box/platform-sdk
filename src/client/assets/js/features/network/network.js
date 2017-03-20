import { createStructuredSelector } from 'reselect';

const NETWORK_ACCESS  = 'iot.red/network/NETWORK_ACCESS';
const NETWORK_ERROR  = 'iot.red/network/NETWORK_ERROR';
const NETWORK_SUCCESS  = 'iot.red/network/NETWORK_SUCCESS';
const NETWORK_COMPLETE  = 'iot.red/network/NETWORK_COMPLETE';

export const NAME = 'network';

const initialState = {
	status:null, 
	message:null
}

export default function reducer(state = initialState , action) {
	
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

function networkAccess(message){
	return {
		type: NETWORK_ACCESS,
		message,
	}
}

function networkError(err){
		
	return function(dispatch, getState){
	
		dispatch({
			type: NETWORK_ERROR,
			err
		});
		
		setTimeout(()=>{
			dispatch({
				type: NETWORK_COMPLETE
			});
		}, 1000);
	}
	
}

function networkSuccess(message){
	
	return function (dispatch, getState) {
	
		dispatch({
			type: NETWORK_SUCCESS,
			message
		});

		setTimeout(()=>{
			dispatch({
				type: NETWORK_COMPLETE
			});
		}, 500);
		
	}
}

const network = (state) => state[NAME];

export const selector = createStructuredSelector({
  network
});

export const actionCreators = {
  networkAccess,
  networkError,
  networkSuccess,
};