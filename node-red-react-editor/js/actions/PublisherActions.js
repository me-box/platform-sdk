import * as ActionTypes from '../constants/ActionTypes';
import request from 'superagent';
import {convertNode} from '../utils/nodeUtils';
import config from '../config';
import {networkAccess, networkError, networkSuccess} from './NetworkActions';
import {receivedSHA, requestRepos} from './RepoActions';

export function packageSelected(id){
	return {
		type: ActionTypes.PUBLISHER_PACKAGE_SELECTED,
		id
	}
}

export function updateAppName(name){
	return {
		type: ActionTypes.PUBLISHER_APP_NAME_CHANGED,
		name
	}
} 

export function updateAppDescription(description){
	return {
		type: ActionTypes.PUBLISHER_APP_DESCRIPTION_CHANGED,
		description
	}
}

export function updateAppTags(tags){
	return {
		type: ActionTypes.PUBLISHER_APP_TAGS_CHANGED,
		tags
	}
}

export function updatePackagePurpose(purpose){
	return {
		type: ActionTypes.PUBLISHER_PACKAGE_PURPOSE_CHANGED,
		purpose,
	}
}
export function installSelected(install){
	return {
		type: ActionTypes.PUBLISHER_PACKAGE_INSTALL_CHANGED,
		install
	}
}

export function updatePackageBenefits(benefits){
	return {
		type: ActionTypes.PUBLISHER_PACKAGE_BENEFITS_CHANGED,
		benefits
	}
}

export function toggleGrid(pkga, pkgb){
	
	return {
		type: ActionTypes.PUBLISHER_TOGGLE_GRID,
		pkga,
		pkgb,
	}
}

export function submissionSuccess(data){
	return {
		type: ActionTypes.PUBLISHER_PUBLISHED_APP,
		data
	}
}


export function receivedManifest(manifest){
	return {
    	type: ActionTypes.RECEIVE_MANIFEST,
    	manifest,
  	}
}

export function submit(){

	return function (dispatch, getState) {
		
		
		
		const jsonnodes = getState().nodes.nodes.map((node)=>{
			return Object.assign({}, convertNode(node, getState().ports.links));
		});
		
		const tabs = getState().tabs.tabs;
	
		const flows = [
  					...tabs,
  					...jsonnodes
  		]
  			
  		//TODO: ensure that the latest commit is saved before publish.
  		
  		const app = getState().publisher.app;
  		const packages = getState().publisher.packages;
  		const repo = getState().repos.loaded;
  		
  		const data = {
  		    
  		    repo : repo,
  		    
  		    flows: flows,
  		    
  		    //assign id at start  as this will be the channel identifier
  		  	manifest: {
  				app: Object.assign({}, getState().publisher.app),
  				packages: getState().publisher.packages,
  				'allowed-combinations': getState().publisher.grid,
  			}
  		};
  		
  		dispatch(networkAccess(`publishing app ${name}`));
  		
		 request
  			.post(`http://${config.root}/github/publish`)
  			.send(data)
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(networkError(err.message));
  				}else{
  					dispatch(networkSuccess('successfully published app!'));
          			//dispatch(submissionSuccess(res.body));
  	 				dispatch(receivedSHA(res.body.repo, res.body.sha));
  	 				dispatch(requestRepos());
  	 			}
  	 		});	
		
		 	
		
	}
}

export function cancel(){
	return {
		type: ActionTypes.PUBLISHER_CANCEL,
	}
}