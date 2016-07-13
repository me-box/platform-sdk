import * as ActionTypes from '../constants/ActionTypes';

export function networkAccess(message){
	return {
		type: ActionTypes.NETWORK_ACCESS,
		message,
	}
}

export function networkError(err){
	
	console.log(err);
	
	return function(dispatch, getState){
	
		dispatch({
			type: ActionTypes.NETWORK_ERROR,
			err
		});
		
		setTimeout(()=>{
			dispatch({
				type: ActionTypes.NETWORK_COMPLETE
			});
		}, 1000);
	}
	
}

export function networkSuccess(message){
	
	return function (dispatch, getState) {
	
		dispatch({
			type: ActionTypes.NETWORK_SUCCESS,
			message
		});

		setTimeout(()=>{
			dispatch({
				type: ActionTypes.NETWORK_COMPLETE
			});
		}, 500);
		
	}
}