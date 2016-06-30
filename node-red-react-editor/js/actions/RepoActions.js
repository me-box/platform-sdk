import request  from 'superagent';
import * as ActionType from '../constants/ActionTypes';
import config from '../config';
import {convertNode} from '../utils/nodeUtils';

export function nameChanged(name){
	return {
		type: ActionType.REPO_NAME_CHANGED,
		name,
	}
}

export function commitChanged(commit){
    return {
      type: ActionType.REPO_COMMIT_CHANGED,
      commit
    }
}

export function descriptionChanged(description){
	return {
		type: ActionType.REPO_DESCRIPTION_CHANGED,
		description
	}
}

export function savingSubmission(){
	return {
		type: ActionType.REPO_SAVING,
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


export function requestingRepos(){
	return {
		type: ActionType.REPO_REQUESTING_LIST
	}
}

export function receivedRepos(repos){
	return {
		type: ActionType.REPO_LIST_RETRIEVED,
		repos,
	}
}

export function receivedCommit(commit){
	return {
		type: ActionType.REPO_COMMIT_RETRIEVED,
		commit
	}
}

export function requestRepos(){
	return function (dispatch, getState) {
		
		dispatch(requestingRepos());
		
		request
		  .get(`http://${config.root}/github/repos`)
		  .set('Accept', 'application/json')
		  .end(function(err, res){
			if (err){
			  console.log(err);
			}else{
			  console.log(res.body);
			  dispatch(receivedRepos(res.body));
			}
		 });
	}
}

//get all of the current details of this repo and submit to the server!
export function savePressed(){
	
	return function (dispatch, getState) {
		
		dispatch(savingSubmission())

		const jsonnodes = getState().nodes.nodes.map((node)=>{
			return Object.assign({}, convertNode(node, getState().ports.links));
		});
		
		const tabs = getState().tabs.tabs;
		
		const {name, description, commit} = getState().repos.tosave;
		
		const submission = {
		
			name,
			description,
			commit,
			flows: [
  					...tabs,
  					...jsonnodes
  			]
		}
		
	    request
  			.post(`http://${config.root}/github/repo/new`)
  			.send(submission)
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

	return {
		type: ActionType.REPO_SAVE_PRESSED,
	}
}
