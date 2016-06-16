import {TOGGLE_DEPLOY_MENU, TOGGLE_APPMANAGER} from '../constants/ActionTypes';

export default function editor(state = {deploymenuexpanded:false, appmanager:false}, action) {

	switch (action.type) {

		case  TOGGLE_DEPLOY_MENU:
	    	return Object.assign({}, state, {deploymenuexpanded:!state.deploymenuexpanded});
	    
	    case  TOGGLE_APPMANAGER:
	    	return Object.assign({}, state, {appmanager:!state.appmanager});
	
    	default:
    		return state;
    }
}