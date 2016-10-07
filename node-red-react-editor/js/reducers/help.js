import { HELP_UPDATE_DESCRIPTION, HELP_UPDATE_OUTPUT_SCHEMA } from '../constants/ActionTypes';

export default function help(state = {description:{}, outputschema:{}}, action) {

	switch (action.type) {

		case HELP_UPDATE_DESCRIPTION:
			return Object.assign({}, state, {description: Object.assign({}, state.description, {[action.id]: action.description})});
		
		case HELP_UPDATE_OUTPUT_SCHEMA:
			return Object.assign({}, state, {outputschema: Object.assign({}, state.outputschema, {[action.id]: action.schema})});

    	default:
    		return state;
    }
}