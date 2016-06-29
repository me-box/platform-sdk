import { PUBLISHER_PACKAGE_SELECTED,PUBLISHER_APP_NAME_CHANGED,PUBLISHER_APP_DESCRIPTION_CHANGED,PUBLISHER_APP_TAGS_CHANGED,PUBLISHER_PACKAGE_DESCRIPTION_CHANGED,PUBLISHER_PACKAGE_INSTALL_CHANGED,PUBLISHER_PACKAGE_BENEFITS_CHANGED,PUBLISHER_TOGGLE_GRID } from '../constants/ActionTypes';
import request from 'superagent';
import {convertNode} from '../utils/nodeUtils';

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
  		
  		
  		const app = {
  			app: getState().publisher.app,
  			packages: getState().publisher.packages,
  			forbidmix: getState().publisher.grid,
  		}
  		
  		console.log("app is ");
  		console.log(app);
  	
		/*dispatch(publishingApp());
		
		request
  			.get(`http://${config.root}/github/flow`)
  			.query({repo:repo})
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(receiveFlowsError(err));
  				}else{
  				
  					//create all of the tabs
  					dispatch(receiveTabs(res.body.filter((node)=>{
  						return node.type === "tab"
  					})));
  					
  					//create all of the flows
          			dispatch(receiveFlows(res.body, store, _lookup.bind(this,getState().types.nodetypes)));  //bind the lookup function to the current set of node types
  	 			}
  	 		});		
		*/
	}
}

export function cancel(){

}