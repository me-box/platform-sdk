import { PUBLISHER_PACKAGE_SELECTED,PUBLISHER_APP_NAME_CHANGED,PUBLISHER_APP_DESCRIPTION_CHANGED,PUBLISHER_APP_TAGS_CHANGED,PUBLISHER_PACKAGE_DESCRIPTION_CHANGED,PUBLISHER_PACKAGE_INSTALL_CHANGED,PUBLISHER_PACKAGE_BENEFITS_CHANGED,PUBLISHER_TOGGLE_GRID } from '../constants/ActionTypes';
import request from 'superagent';
import {convertNode} from '../utils/nodeUtils';
import config from '../config';

export function packageSelected(id){
	return {
		type: PUBLISHER_PACKAGE_SELECTED,
		id
	}
}

export function updateAppName(name){
	return {
		type: PUBLISHER_APP_NAME_CHANGED,
		name
	}
} 

export function updateAppDescription(description){
	return {
		type: PUBLISHER_APP_DESCRIPTION_CHANGED,
		description
	}
}

export function updateAppTags(tags){
	return {
		type: PUBLISHER_APP_TAGS_CHANGED,
		tags
	}
}

export function updatePackageDescription(description){
	return {
		type: PUBLISHER_PACKAGE_DESCRIPTION_CHANGED,
		description,
	}
}
export function installSelected(install){
	return {
		type: PUBLISHER_PACKAGE_INSTALL_CHANGED,
		install
	}
}

export function updatePackageBenefits(benefits){
	return {
		type: PUBLISHER_PACKAGE_BENEFITS_CHANGED,
		benefits
	}
}

export function toggleGrid(pkga, pkgb){
	
	return {
		type: PUBLISHER_TOGGLE_GRID,
		pkga,
		pkgb,
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
  		
  		
  		
  		console.log("flows are");
  		console.log(flows);
  		
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
  				app: getState().publisher.app,
  				packages: getState().publisher.packages,
  				'forbidden-combinations': getState().publisher.grid,
  			}
  		};
  	
		/*dispatch(publishingApp());*/
		
		 request
  			.post(`http://${config.root}/github/publish`)
  			.send(data)
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					//dispatch(submissionError(err));
  				}else{
          			console.log("got");
          			console.log(res.body);
          			//dispatch(submissionResponse(res.body));
  	 			}
  	 		});	
		
		 	
		
	}
}

export function cancel(){

}