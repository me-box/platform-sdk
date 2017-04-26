import { createStructuredSelector } from 'reselect';
import {actionCreators as editorActions} from 'features/editor';
import {nodesWithTestOutputs} from 'utils/utils';
import {getID, convertNode} from 'utils/nodeUtils';

const APP_MESSAGE  = 'iot.red/apps/APP_MESSAGE';
const RECEIVE_FLOWS  = 'iot.red/apps/RECEIVE_FLOWS';
const DEPLOY_SUCCESS  = 'iot.red/apps/DEPLOY_SUCCESS';
const DEPLOY_ERROR  = 'iot.red/apps/DEPLOY_ERROR';
const DEPLOYING_FLOWS  = 'iot.red/apps/DEPLOYING_FLOWS';


export const NAME = 'apps';

const addIfNew = (state, action) =>{
	switch (action.type){

		case APP_MESSAGE:
		
			//can make this more efficient if need 
			if (state.data.map(t=>{return t.id}).indexOf(action.id) !== -1){
				return state.data.map(t=>{
					if (t.id === action.id){
						t.name = action.name;
					}
					return t;
				});
			}
			return [...state.data, {id:action.id, name:action.name, view:action.view, data:[]}]

		default:
			return state;
	}
}

const app = (state, action) =>{

	console.log("----> app seen action ");
	console.log(action);
	
	switch (action.type){
		case APP_MESSAGE:

			if (state.id !== action.id){
				return state;
			}

			if (action.policy === "replace"){
				return Object.assign({}, state, {data: action.data, view:action.view})
			}else{
				return Object.assign({}, state, {data: [...state.data, action.data], view:action.view})
			}
			
		default:
			return state;
	}
}

//used by test manager - apps are all the mock apps running on node red.
export default function reducer(state = {data:[], deploying:false}, action) {
  	switch (action.type) { 
	  
	  
	  case DEPLOYING_FLOWS:
	  	return Object.assign({}, state, {deploying:true});
	  	
	  //reset the app data when we retest a flow or we load in a new flow
	  case DEPLOY_SUCCESS:
	  case RECEIVE_FLOWS:
	  	return Object.assign({}, state, {deploying:false, data:[]});
	  	//return Object.assign({}, state, {deploying:false, data:[]});
	  	
	  case APP_MESSAGE:
	  
	  	if (!state.deploying){
	  		return Object.assign({}, state, {data:addIfNew(state, action).map(s=>{
	  			return app(s, action);
	  		})});
	  	}
	  	
	  	return state;
	  	

	  default:
	    return state;
	}
}

function deployFlows(){
	return function (dispatch, getState) {
		dispatch({
			type: ActionType.DEPLOYING_FLOWS
		});
	}
}

function deployError(err){
	return {
		type: ActionType.DEPLOY_ERROR,
		err,
	}
}

function deployResponse(data){
	return {
		type: ActionType.DEPLOY_SUCCESS,
		data,
	}
}

function receiveFlows(){
	return {
		type: RECEIVE_FLOWS,
	}
}

function deploy(){
	
	return function (dispatch, getState) {
		
		dispatch(editorActions.showTestSidebar());
	
		if (nodesWithTestOutputs(getState().nodes.nodes).length <= 0){
			console.log("not dispatching a test - no outputs that can be tested");
			return;
		}
		
		dispatch(deployFlows())
		
		//don't bother deploying if there are no outputs that can be tested (i.e. node.type == "debugger" or node.type === "app"
		const channelId = getState().publisher.app.id;
	
		const jsonnodes = getState().nodes.nodes.map((node)=>{
			
			const modifier = node.type === "app" ? {appId: channelId} : {}; //inject the appID
			const n = Object.assign({}, convertNode(node, getState().ports.links), modifier);
			if (n.type==="app"){
				console.log("app to deploy is");
				console.log(n);
			}
			return n;
		});
		
		
		const tabs = getState().tabs.tabs;
		
		
		console.log([...tabs, ...jsonnodes]);
		console.log(`DEPLOYING TO ${config.root}/nodered/flows`);
		
		
	    request
  			.post(`${config.root}/nodered/flows`)
  			.send([
  					...tabs,
  					...jsonnodes
  				])
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(deployError(err));
  				}else{
  					//TODO: make sure server responds!
  					console.log("**** GOT RESPONSE!!*****");
          			dispatch(deployResponse(res.body));
          			
  	 			}
  	 		});		
	}

}

const apps = (state) => state[NAME];

export const selector = createStructuredSelector({
  apps
});

export const actionCreators = {
  deploy,
  receiveFlows,
};
