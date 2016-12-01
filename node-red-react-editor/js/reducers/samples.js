import * as ActionType from '../constants/ActionTypes';

export default function samples(state = {}, action) {
	switch(action.type){
		case ActionType.RECEIVE_SAMPLE_DATA:
			return Object.assign(state, {}, action.data);
		default:
			return state;
	}
}