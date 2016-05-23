import request  from 'superagent';
import { TOGGLE_DEPLOY_MENU, DEPLOY_CLICKED, SUBMITTING_FLOWS, SUBMISSION_RESPONSE, SUBMISSION_ERROR } from '../constants/ActionTypes';
import {convertNode} from '../utils/nodeUtils';

export function toggleDeployMenu(){
    return {
      type: TOGGLE_DEPLOY_MENU,
    }
}

export function postFlows(){
	return {
		type: SUBMITTING_FLOWS
	}
}

export function submissionError(err){
	return {
		type: SUBMISSION_ERROR,
		err,
	}
}

export function submissionResponse(data){
	return {
		type: SUBMISSION_RESPONSE,
		data,
	}
}

//this will change the multiplier for the 'repeat' value 
export function deploy(){
	
	return function (dispatch, getState) {
		
		dispatch(postFlows())

		const jsonnodes = getState().nodes.nodes.map((node)=>{
			return Object.assign({}, convertNode(node, getState().ports.links), {z:'2cc3b486.16d4ec'});
		});
		
		console.log(jsonnodes);

	    request
  			.post('http://localhost:1880/flows')
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
