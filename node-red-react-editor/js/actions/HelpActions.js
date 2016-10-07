import {HELP_UPDATE_DESCRIPTION, HELP_UPDATE_OUTPUT_SCHEMA} from '../constants/ActionTypes';

export function updateDescription(id,description){
	return{
		type: HELP_UPDATE_DESCRIPTION,
		id,
		description,
	}
}

export function updateOutputSchema(id,schema){	
	return{
		type: HELP_UPDATE_OUTPUT_SCHEMA,
		id,
		schema,
	}
}
