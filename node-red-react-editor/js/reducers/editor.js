import {TOGGLE_DEPLOY_MENU, TOGGLE_SAVE} from '../constants/ActionTypes';

export default function editor(state = {deploymenuexpanded:false, savedialogue:false}, action) {

	switch (action.type) {

		case  TOGGLE_DEPLOY_MENU:
	    	return Object.assign({}, state, {deploymenuexpanded:!state.deploymenuexpanded});
	    
	    case  TOGGLE_SAVE:
	    	return Object.assign({}, state, {savedialogue:!state.savedialogue});

    	default:
    		return state;
    }
}