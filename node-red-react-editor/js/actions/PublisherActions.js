import * as ActionTypes from '../constants/ActionTypes';
import request from 'superagent';
import {convertNode, getID} from '../utils/nodeUtils';
import config from '../config';
import {networkAccess, networkError, networkSuccess} from './NetworkActions';

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

export function publishingApp(name){
	return networkAccess(`publishing app ${name}`);
}

export function submissionSuccess(data){
	return function (dispatch, getState) {
		
		dispatch(networkSuccess('successfully published app!'));
		
		dispatch({
			type: ActionTypes.PUBLISHER_PUBLISHED_APP,
			data
		});
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
  			
  		//https://raw.githubusercontent.com/tlodge/databox.threepackages/02c299dd4b8f03eda5b83f710fc026b572a59837/flows.json
  		
  		//have to ensure that the latest commit is saved before can publish! (or do this automatically at server end!)
  		
  		const app = getState().publisher.app;
  		const packages = getState().publisher.packages;
  		
  		
  		const data = {
  		    
  		    repo: {
  		    		name: getState().repos.loaded.name, 
  		    		sha: getState().repos.loaded.sha
  		    },
  
  			manifest: {
  				app: Object.assign({}, getState().publisher.app, {id: getID()}),
  				packages: getState().publisher.packages,
  				'forbidden-combinations': getState().publisher.grid,
  			}
  		};
  		
  		dispatch(publishingApp(app.name));
  	
		
		 request
  			.post(`http://${config.root}/github/publish`)
  			.send(data)
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log("seen an arrroor");
  					console.log(err);
  					dispatch(networkError(err.message));
  				}else{
  					console.log("seen a succcess!");
          			dispatch(submissionSuccess(res.body));
  	 			}
  	 		});	
		
		 	
		
	}
}

export function cancel(){

}