import { createStructuredSelector } from 'reselect';
import {actionCreators as workspaceActions} from 'features/workspace';
import request  from 'superagent';
import config from 'config';
import {getID} from 'utils/nodeUtils';
import {unregisterAll} from 'app/store/configureStore';

import {actionCreators as nodeActions} from 'features/nodes/actions';
import {actionCreators as portActions} from 'features/ports';


const TOGGLE_DEPLOY_MENU  = 'iot.red/editor/TOGGLE_DEPLOY_MENU';
const SIDEBAR_CLOSE  = 'iot.red/editor/SIDEBAR_CLOSE';
const SHOW_TEST_SIDEBAR  = 'iot.red/editor/SHOW_TEST_SIDEBAR';
const CLOSE_ALL = 'iot.red/editor/CLOSE_ALL';
const WINDOW_RESIZED  = 'iot.red/editor/WINDOW_RESIZED';
const CLEAR = 'iot.red/editor/CLEAR';

export const NAME = 'editor';

let logincheck = null;

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

export default function reducer(state = initialState, action={}) {
	
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
	
		case  WINDOW_RESIZED:
	    	return Object.assign({}, state, {
        		screen: {w:action.w, h: action.h}
      		})

    	default:
    		return state;
    }
}


function checkLoggedIn(){
	request
		.get(`${config.root}/auth/loggedin`)
		.set('Accept', 'application/json')
		.timeout({response: 1500})
		.end(function(err, res){
			if (err){
				console.log(err);
			}
			const {status} = res.body;
			if (status === "fail"){
				window.location.replace(`${config.root}/login`);
			}
		});
}

function initEditor(){
	console.log("IN INIT EDITOR");
	
	if (!logincheck){
		logincheck = setInterval(checkLoggedIn, 5000);
	}

	return (dispatch, getState)=>{
		const id = getID();
		dispatch(workspaceActions.initApp(id));
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

function clear(){
	return function (dispatch, getState) {	
		dispatch(nodeActions.clearNodes());
		dispatch({type:CLEAR});
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
      
   	//don't do anything if delete is pressed when configuring a node
   	if (getState().nodes.configuringId){
   		return;
   	}

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
  clear,
};
