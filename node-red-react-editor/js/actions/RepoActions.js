import request  from 'superagent';
import * as ActionType from '../constants/ActionTypes';
import config from '../config';
import {convertNode, getID} from '../utils/nodeUtils';
import {networkAccess, networkError, networkSuccess} from './NetworkActions';


export function browseNewUser(){
	return function (dispatch, getState) {
		
		const githubuser = getState().repos.browsingname;
		
		dispatch(networkAccess(`requesting repo list for user ${githubuser}`));
		
		request
		  .get(`http://${config.root}/github/repos/${githubuser}`)
		  .set('Accept', 'application/json')
		  .end(function(err, res){
			if (err){
			  console.log(err);
			  dispatch(networkError(`failed to fetch repo list`));
			}else{
			  console.log(res.body);
			  dispatch(networkSuccess(`successfully received repos`));
			  dispatch(receivedRepos(res.body));
			  dispatch(setCurrentUser(githubuser));
			}
		 });
	}		 
}

export function toggleSaveDialogue(){
	return {
		type: ActionType.TOGGLE_SAVE_DIALOGUE,
	}
}


export function setCurrentUser(name){
	return {
		type: ActionType.REPO_CURRENTUSER_CHANGED,
		name,
	}
}

export function  browsingNameChanged(name){
	return {
		type: ActionType.REPO_BROWSINGNAME_CHANGED,
		name,
	}
}

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

/*export function savingSubmission(){
	return {
		type: ActionType.REPO_SAVING,
	}
}*/

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

export function receivedRepos(repos){
	return {
		type: ActionType.REPO_LIST_RETRIEVED,
		repos,
	}
}

export function receivedSHA(repo, sha){
	return {
		type: ActionType.REPO_SHA_RETRIEVED,
		repo,
		sha
	}
}

export function requestRepos(){
	return function (dispatch, getState) {
		
		dispatch(networkAccess(`requesting repo list`));
		request
		  .get(`http://${config.root}/github/repos`)
		  .set('Accept', 'application/json')
		  .end(function(err, res){
			if (err){
			  console.log(err);
			  dispatch(networkError(`failed to fetch repo list`));
			}else{
			  console.log(res.body);
			  dispatch(networkSuccess(`successfully received repos`));
			  dispatch(receivedRepos(res.body));
			}
		 });
	}
}

export function commitPressed(){

	return function (dispatch, getState) {	
		console.log("commit poressed!");
		console.log(getState().repos.loaded);
		
		const message = getState().repos.tosave.commit;
		console.log(message);
		
		const repo = getState().repos.loaded;
		
		const jsonnodes = getState().nodes.nodes.map((node)=>{
			return Object.assign({}, convertNode(node, getState().ports.links));
		});
		
		const tabs = getState().tabs.tabs;
		 
		const data = { 
			repo: repo.name, 
			flow: [...tabs,...jsonnodes],
			sha: repo.sha.flows,
			message: message || 'cp commit',
		}
		
		dispatch(networkAccess(`saving flows`));
		
		request
			.post(`http://${config.root}/github/repo/update`)
			.send(data)
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(networkError(err.message));
  				}else{
  					dispatch(networkSuccess('successfully saved changes!'));
  					dispatch(receivedSHA(repo.name, {flows:res.body.sha}));
  	 			}
  	 		});	
	}	 
}

//get all of the current details of this repo and submit to the server!
export function savePressed(){
	
	return function (dispatch, getState) {
		
		dispatch(networkAccess(`saving submission`));
		//dispatch(savingSubmission())

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
  			],
  			manifest: {
  				app: Object.assign({}, getState().publisher.app, {id: getID()}),
  				packages: getState().publisher.packages,
  				'allowed-combinations': getState().publisher.grid,
  			}
		}
		
	    request
  			.post(`http://${config.root}/github/repo/new`)
  			.send(submission)
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					//dispatch(submissionError(err));
  					dispatch(networkError('error saving app'));
  				}else{
          			console.log("got");
          			console.log(res.body);
          			dispatch(networkSuccess('successfully saved app'));
          			dispatch(receivedSHA(res.body.repo, res.body.sha));
          			//dispatch(submissionResponse(res.body));
          			//dispatch(receivedCommit(res.body.commit))
  	 			}
  	 		});
  	 }		
}
