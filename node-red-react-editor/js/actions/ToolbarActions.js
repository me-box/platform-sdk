import request  from 'superagent';
import * as ActionType from '../constants/ActionTypes';
import {convertNode} from '../utils/nodeUtils';
import config from '../config';



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

export function postFlows(){
	return {
		type: ActionType.SUBMITTING_FLOWS
	}
}

export function submissionError(err){
	return {
		type: ActionType.SUBMISSION_ERROR,
		err,
	}
}

export function submissionResponse(data){
	return {
		type: ActionType.SUBMISSION_RESPONSE,
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

export function deploy(){
	
	return function (dispatch, getState) {
		
		dispatch(postFlows())

		const channelId = getState().publisher.app.id;
		
		const jsonnodes = getState().nodes.nodes.map((node)=>{
			
			const modifier = node.type === "app" ? {appId: getState().publisher.app.id} : {};
			const n = Object.assign({}, convertNode(node, getState().ports.links), modifier);
			console.log("n is ");
			console.log(n);
			return n;
		});
		
		
		const tabs = getState().tabs.tabs;
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
  					dispatch(submissionError(err));
  				}else{
          			dispatch(submissionResponse(res.body));
  	 			}
  	 		});		
	}

}
