import {TOGGLE_DEPLOY_MENU, TOGGLE_APPMANAGER, TOGGLE_PUBLISHER, PUBLISHER_CANCEL, SIDEBAR_CLOSE, NODE_MOUSE_DOWN, NODE_DROPPED, SHOW_TEST_SIDEBAR, TOGGLE_SAVE_DIALOGUE} from '../constants/ActionTypes';

export default function editor(state = {deploymenuexpanded:false, appmanager:false, testing: false,publisher:false, savedialogue:false}, action) {

	switch (action.type) {

		case SIDEBAR_CLOSE:
			return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										appmanager: false,
	    										testing: false,
	    									 });
	    
	    case SHOW_TEST_SIDEBAR:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										appmanager: false,
	    										testing: true,
	    									 });
	    	
	    case  NODE_MOUSE_DOWN:
	    case NODE_DROPPED:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										appmanager: false,
	    										testing: false,
	    									 });					
	    									 		 
		case  TOGGLE_DEPLOY_MENU:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:!state.deploymenuexpanded,
	    									 });
	    
	    case  TOGGLE_APPMANAGER:
	    	return Object.assign({}, state, {
	    										appmanager:!state.appmanager,
	    									});
	    									
	    case TOGGLE_PUBLISHER:
	    	
	    	return Object.assign({}, state, {
	    										publisher: !state.publisher,
	    										appmanager: !state.publisher ? false : state.appmanager,
	    										testing: !state.publisher ? false: state.testing,
	    									});
	    									
		case PUBLISHER_CANCEL:
			return Object.assign({}, state, {
							publisher: false,
			});
			
		case TOGGLE_SAVE_DIALOGUE:
			return Object.assign({}, state, {
				savedialogue: !state.savedialogue,
			});

    	default:
    		return state;
    }
}