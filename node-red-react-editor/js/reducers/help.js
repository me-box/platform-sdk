import { HELP_UPDATE_DESCRIPTION } from '../constants/ActionTypes';

export default function help(state = {description:null}, action) {

	switch (action.type) {

		case HELP_UPDATE_DESCRIPTION:
			return Object.assign({}, state, {description: action.description});
	

    	default:
    		return state;
    }
}