import {TOGGLE_DEPLOY_MENU, TOGGLE_APPMANAGER, TOGGLE_PUBLISHER, SIDEBAR_CLOSE, NODE_MOUSE_DOWN, SUBMITTING_FLOWS} from '../constants/ActionTypes';

export default function editor(state = {deploymenuexpanded:false, appmanager:false, nodedetails: false, testdeploy:false, publisher:false}, action) {

	switch (action.type) {

		case SIDEBAR_CLOSE:
			return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										appmanager: false,
	    										nodedetails: false,
	    										testdeploy: false,
	    									 });
	    
	    case SUBMITTING_FLOWS:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										appmanager: false,
	    										nodedetails: false,
	    										testdeploy: true,
	    									 });
	    	
	    case  NODE_MOUSE_DOWN:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										appmanager: false,
	    										nodedetails: true,
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
	    										nodedetails: !state.publisher ? false : state.nodedetails,
	    										testdeploy: !state.publisher ? false : state.testdeploy,
	    									});
	    									
	
		
    	default:
    		return state;
    }
}