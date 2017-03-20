import { createStructuredSelector } from 'reselect';
import {actionCreators as publisherActions} from 'features/publisher';
import request  from 'superagent';
import config from 'config';
import {getID} from 'utils/nodeUtils';


import {actionCreators as nodeActions} from 'features/nodes/actions';
import {actionCreators as portActions} from 'features/ports';

const TOGGLE_DEPLOY_MENU  = 'iot.red/editor/TOGGLE_DEPLOY_MENU';
const SIDEBAR_CLOSE  = 'iot.red/editor/SIDEBAR_CLOSE';
const SHOW_TEST_SIDEBAR  = 'iot.red/editor/SHOW_TEST_SIDEBAR';
const CLOSE_ALL = 'iot.red/editor/CLOSE_ALL';
const WINDOW_RESIZED  = 'iot.red/editor/WINDOW_RESIZED';

export const NAME = 'editor';

const initialState = {
	deploymenuexpanded:false, 
	testing: false,
	publisher:false, 
	savedialogue:false,
	screen: {
       w : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
       h : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
    }
}

export default function reducer(state = initialState, action) {

	switch (action.type) {

		case SIDEBAR_CLOSE:
			return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										repomanager: false,
	    										testing: false,
	    									 });
	    
	    case SHOW_TEST_SIDEBAR:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										repomanager: false,
	    										testing: true,
	    									 });
	    	
	    case CLOSE_ALL:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:false,
	    										repomanager: false,
	    										testing: false,
	    									 });					
	    									 		 
		case  TOGGLE_DEPLOY_MENU:
	    	return Object.assign({}, state, {
	    										deploymenuexpanded:!state.deploymenuexpanded,
	    									 });
	    
	    									
	    /*case TOGGLE_PUBLISHER:
	    	
	    	return Object.assign({}, state, {
	    										publisher: !state.publisher,
	    										repomanager: !state.publisher ? false : state.repomanager,
	    										testing: !state.publisher ? false: state.testing,
	    									});
	    									
		case PUBLISHER_CANCEL:
			return Object.assign({}, state, {
							publisher: false,
			});*/
			
	
		case  WINDOW_RESIZED:
	    	return Object.assign({}, state, {
        		screen: {w:action.w, h: action.h}
      		})

    	default:
    		return state;
    }
}


function initEditor(){
	return (dispatch, getState)=>{
		const id = getID();
		dispatch(publisherActions.initEditor(id));
	}
}

function closeSideBar(){
	return {
		type: SIDEBAR_CLOSE,
	}
}

function toggleDeployMenu(){
    return {
      type: TOGGLE_DEPLOY_MENU,
    }
}


function showTestSidebar(){
	return {
		type: SHOW_TEST_SIDEBAR,
	}	
}

function publisherCancel(){
	return {
		type:PUBLISHER_CANCEL,
	}	
}

function logout(){
	return function (dispatch, getState) {	
		request
		  .get(`${config.root}/auth/logout`)
		  .set('Accept', 'application/json')
		  .end(function(err, res){});
	}	 
}


function closeAll(){
	return{
		type: CLOSE_ALL,
	}
} 

function windowResize(w,h) {
  return {
    type: WINDOW_RESIZED,
    w,
    h
  };
}

function deletePressed() {

  return function(dispatch, getState) {
      
    const node = getState().nodes.selectedId;
	const link = getState().ports.selectedId;
	    
  	if (node){
  		dispatch(portActions.nodeDelete(node));
      	dispatch(nodeActions.nodeDelete(node));
      	
  	}
  	
  	if (link){
  		dispatch(portActions.linkDelete(link));
  	}
  };
}

const editor = (state) => state[NAME];

export const selector = createStructuredSelector({
  editor
});

export const actionCreators = {
  initEditor,
  closeSideBar,
  showTestSidebar,
  toggleDeployMenu,
  logout,
  closeAll,
  windowResize,
  deletePressed,
};
