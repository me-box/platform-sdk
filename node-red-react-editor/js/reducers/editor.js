import {TOGGLE_DEPLOY_MENU} from '../constants/ActionTypes';

export default function editor(state = {deploymenuexpanded:false}, action) {

	switch (action.type) {

		case  TOGGLE_DEPLOY_MENU:
	    	return Object.assign({}, state, {deploymenuexpanded:!state.deploymenuexpanded});

    	default:
    		return state;
    }
}