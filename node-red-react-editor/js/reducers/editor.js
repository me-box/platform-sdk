import {TOGGLE_DEPLOY_MENU, TOGGLE_APPMANAGER, TOGGLE_PUBLISHER} from '../constants/ActionTypes';

export default function editor(state = {deploymenuexpanded:false, appmanager:false, sidebarExpanded:false, publisher:false}, action) {

	switch (action.type) {

		case  TOGGLE_DEPLOY_MENU:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:!state.deploymenuexpanded,
	    										sidebarExpanded: !state.deploymenuexpanded || state.appmanager	
	    									 });
	    
	    case  TOGGLE_APPMANAGER:
	    	return Object.assign({}, state, {
	    										appmanager:!state.appmanager,
	    										sidebarExpanded: state.deploymenuexpanded || !state.appmanager	
	    									});
	
	    case TOGGLE_PUBLISHER:
	    	return Object.assign({}, state, {
	    										publisher: !state.publisher,
	    									});
    	default:
    		return state;
    }
}