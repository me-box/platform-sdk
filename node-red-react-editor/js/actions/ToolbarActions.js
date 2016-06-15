import request  from 'superagent';
import * as ActionType from '../constants/ActionTypes';
import {convertNode} from '../utils/nodeUtils';
import config from '../config';


export function toggleSave(){
	return {
		type: ActionType.TOGGLE_SAVE,
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

export function publish(){
	return function (dispatch, getState) {
		
		dispatch(publishFlows())
		
		const jsonnodes = getState().nodes.nodes.map((node)=>{
			return Object.assign({}, convertNode(node, getState().ports.links), {z:'2cc3b486.16d4ec'});
		});
	    
	    request
  			.post(`http://${config.root}/publish`)
  			.send([
  					{
  						type:"tab",
  						id:"2cc3b486.16d4ec",
  						label:"Flow 1"
  					},
  					...jsonnodes
  				])
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(publishError(err));
  				}else{
          			console.log("got");
          			console.log(res.body);
          			dispatch(publishResponse(res.body));
  	 			}
  	 		});		
	}

		
		
}

//this will change the multiplier for the 'repeat' value 
export function deploy(){
	
	return function (dispatch, getState) {
		
		dispatch(postFlows())

		const jsonnodes = getState().nodes.nodes.map((node)=>{
			return Object.assign({}, convertNode(node, getState().ports.links), {z:'2cc3b486.16d4ec'});
		});
		
		

	    request
  			.post(`http://${config.redurl}/flows`)
  			.send([
  					{
  						type:"tab",
  						id:"2cc3b486.16d4ec",
  						label:"Flow 1"
  					},
  					...jsonnodes
  				])
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(submissionError(err));
  				}else{
          			console.log("got");
          			console.log(res.body);
          			dispatch(submissionResponse(res.body));
  	 			}
  	 		});		
	}

}
