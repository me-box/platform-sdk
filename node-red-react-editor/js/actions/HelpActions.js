import {HELP_UPDATE_DESCRIPTION} from '../constants/ActionTypes';

export function updateDescription(description){
	return {
		type: HELP_UPDATE_DESCRIPTION,
		description,
	}
}

