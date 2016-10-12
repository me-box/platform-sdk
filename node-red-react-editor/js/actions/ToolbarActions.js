import request  from 'superagent';
import * as ActionType from '../constants/ActionTypes';
import {convertNode} from '../utils/nodeUtils';
import config from '../config';
import {leave} from '../comms/websocket';



export function toggleAppManager(){
	return {
		type: ActionType.TOGGLE_APPMANAGER,
	}
}

export function toggleDeployMenu(){
    return {
      type: ActionType.TOGGLE_DEPLOY_MENU,
    }
}

export function deployFlows(){
	return function (dispatch, getState) {
		leave(getState().publisher.app.id);
		dispatch({
			type: ActionType.DEPLOYING_FLOWS
		});
	}
}

export function deployError(err){
	return {
		type: ActionType.DEPLOY_ERROR,
		err,
	}
}

export function deployResponse(data){
	return {
		type: ActionType.DEPLOY_SUCCESS,
		data,
	}
}

export function publishFlows(){
	return {
		type: ActionType.PUBLISHING_FLOWS
	}
}

export function publishError(err){
	return {
		type: ActionType.PUBLISH_ERROR,
		err,
	}
}

export function publishResponse(data){
	return {
		type: ActionType.PUBLISH_RESPONSE,
		data,
	}
}

export function togglePublisher(){
	return {
		type: ActionType.TOGGLE_PUBLISHER,
	}	
}


export function logout(){
	return function (dispatch, getState) {	
		request
		  .get(`http://${config.root}/auth/logout`)
		  .set('Accept', 'application/json')
		  .end(function(err, res){});
	}	 
}


export function deploy(){
	
	return function (dispatch, getState) {
		
		dispatch(deployFlows())

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
		console.log(`DEPLOYING TO http://${config.root}/nodered/flows`);
		
		
	    request
  			.post(`http://${config.root}/nodered/flows`)
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
          			dispatch(deployResponse(res.body));
  	 			}
  	 		});		
	}

}
