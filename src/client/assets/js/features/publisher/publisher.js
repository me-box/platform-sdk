import { createStructuredSelector } from 'reselect';
import request from 'superagent';
import {convertNode} from 'utils/nodeUtils';
import config from 'config';
import {actionCreators as networkActions} from 'features/network';
import {actionCreators as repoActions} from 'features/repos/actions';
import {actionCreators as editorActions} from 'features/editor';
import {NAME as NODENAME} from 'features/nodes';

import {actionConstants as repoConstants} from 'features/repos/constants';

const PUBLISHER_PACKAGE_PURPOSE_CHANGED  = 'iot.red/publisher/PUBLISHER_PACKAGE_PURPOSE_CHANGED';
const PUBLISHER_PACKAGE_INSTALL_CHANGED  = 'iot.red/publisher/PUBLISHER_PACKAGE_INSTALL_CHANGED';
const PUBLISHER_PACKAGE_BENEFITS_CHANGED  = 'iot.red/publisher/PUBLISHER_PACKAGE_BENEFITS_CHANGED';
const PUBLISHER_APP_DESCRIPTION_CHANGED  = 'iot.red/publisher/PUBLISHER_APP_DESCRIPTION_CHANGED';
const PUBLISHER_APP_NAME_CHANGED  = 'iot.red/publisher/PUBLISHER_APP_NAME_CHANGED';
const PUBLISHER_APP_TAGS_CHANGED  = 'iot.red/publisher/PUBLISHER_APP_TAGS_CHANGED';
const PUBLISHER_PACKAGE_SELECTED  = 'iot.red/publisher/PUBLISHER_PACKAGE_SELECTED';
const PUBLISHER_TOGGLE_GRID  = 'iot.red/publisher/PUBLISHER_TOGGLE_GRID';
const PUBLISHER_TOGGLE_VISIBLE = 'iot.red/publisher/PUBLISHER_TOGGLE_VISIBLE';
const PUBLISHER_CANCEL	= 'iot.red/publisher/PUBLISHER_CANCEL';

const EDITOR_INIT = 'iot.red/publisher/EDITOR_INIT';
const TAB_SELECT = 'iot.red/publisher/TAB_SELECT';
const TAB_ADD =  'iot.red/publisher/TAB_ADD';
const TAB_UPDATE =  'iot.red/publisher/TAB_UPDATE';
const TABS_LOAD	= 'iot.red/publisher/TABS_LOAD';

//foreign actions
const {RECEIVE_MANIFEST}	= repoConstants;


export const NAME = 'publisher';


const initialState = {
		app:{},  
		currentpkg:"", 
		packages:[], 
		grid:[], 
		visible:false,
}

const pkgState = {
	id:"", 
	name:"", 
	purpose:"", 
	install:"optional", 
	risk:"", 
	benefits:""
}

const appState = {
 	id:"", 
 	name:"", 
 	description:"", 
 	tags:""
}

const pkg = (state = pkgState, action)=>{
	switch (action.type) {
		
		case TAB_UPDATE:
			if (state.id === action.id)
				return  Object.assign({}, state, {name:action.label});
			return state;
		
		case TAB_ADD:
			return Object.assign({}, state, {name:action.tab.label, id:action.tab.id}); //initialise the state properly if it doesn't exist!
		
			
		case PUBLISHER_PACKAGE_PURPOSE_CHANGED:
			return Object.assign({}, state, {purpose:action.purpose});
		
			
		case PUBLISHER_PACKAGE_INSTALL_CHANGED:
			return Object.assign({}, state, {install:action.install});
		
			
		case PUBLISHER_PACKAGE_BENEFITS_CHANGED:
			return Object.assign({}, state, {benefits:action.benefits});
			
	}
}

const application = (state=appState, action)=>{
	switch (action.type) {
	
	 case EDITOR_INIT:
		return Object.assign({}, state, {id:action.id});
		
	 case PUBLISHER_APP_DESCRIPTION_CHANGED:
	 	return Object.assign({}, state, {description:action.description});
	 
	 case PUBLISHER_APP_NAME_CHANGED:
	 	return Object.assign({}, state, {name:_gitify(action.name)});
	 	
	 case PUBLISHER_APP_TAGS_CHANGED:
	 	return Object.assign({}, state, {tags:action.tags});
	}
}

const _indexOf = (arr, x, y)=>{
	 
	for (let i = 0; i < arr.length; i++){
	 	const item = arr[i];
		if ((item[0] === x && item[1] === y) || (item[0] === y && item[1] === x))
			return i;
	};
	return -1;
} 

const _gitify = (name)=>{
	return name.replace(/\s/g, "-");
}

export default function reducer(state = initialState, action) {
  	switch (action.type) {
	  	
	  case EDITOR_INIT:
	  	return Object.assign({}, state, {app: application(state.app, action)});
	  	
	  case TAB_SELECT:
	  	return Object.assign({}, state, {currentpkg: action.tab.id});//Math.max(0,state.packages.map((p)=>p.id).indexOf(action.tab.id))});
	  
	  case TAB_ADD: //a new package is created in the workspace when a new tab is created!
	  	return Object.assign({}, state, {
	  										packages: [...state.packages, pkg(undefined, action)],
	  										currentpkg: action.tab.id,//state.packages.length	
	  									});
	  	
	  case TAB_UPDATE: 
	  	return Object.assign({}, state, {packages: state.packages.map((p)=>pkg(p,action))}); 
	  
	  case TABS_LOAD:
	  	 return Object.assign({}, state, {packages: action.tabs.map((t)=>pkg(undefined, {type: TAB_ADD, tab: t}))});
	  
	  case RECEIVE_MANIFEST:
	  	 const packages = action.manifest.packages.map((pkg)=>{
	  	 	return Object.keys(pkg).reduce((acc, key)=>{
	  	 		if (key != 'datastores'){
	  	 			acc[key] = pkg[key];
	  	 		}
	  	 		return acc;
	  	 	},{})
	  	 });
	  	 return Object.assign({}, state, {app: action.manifest.app, packages: packages, currentpkg:packages[0].id || "", grid:action.manifest['allowed-combinations']});
	  
	  
	  case PUBLISHER_PACKAGE_SELECTED:
	  	return Object.assign({}, state, {currentpkg: action.id});//Math.max(0,state.packages.map((p)=>p.id).indexOf(action.id))});
	  
	  case PUBLISHER_APP_TAGS_CHANGED:
	  case PUBLISHER_APP_NAME_CHANGED:
	  case PUBLISHER_APP_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {app: application(state.app, action)});
	 	
	 
	  
	  case PUBLISHER_PACKAGE_BENEFITS_CHANGED:
	  case PUBLISHER_PACKAGE_INSTALL_CHANGED:	
	  case PUBLISHER_PACKAGE_PURPOSE_CHANGED:
	  	const pindex = state.packages.map((p)=>p.id).indexOf(state.currentpkg);
	  	
	  	return Object.assign({}, state, {packages: [
	  													...state.packages.slice(0,pindex), 
	  													pkg(state.packages[pindex], action),
	  													...state.packages.slice(pindex+1)]
	  													
	  })  
	  	
	  case PUBLISHER_TOGGLE_GRID:
	  	
	  
	  	const idx = _indexOf(state.grid, action.pkga, action.pkgb);
	    
	    if (idx == -1){
	    	return  Object.assign({}, state, {grid: [...state.grid, [action.pkga, action.pkgb]]});
	    }else{
	    	return Object.assign({}, state, {grid: [...state.grid.slice(0,idx), ...state.grid.slice(idx+1)]});
	    }
	  
	  case PUBLISHER_TOGGLE_VISIBLE:
	  	return Object.assign({}, state, {visible:!state.visible});

	  case PUBLISHER_CANCEL:
	  	return Object.assign({}, state, {visible:false});

	  default:
	    return state;
	}
}


function packageSelected(id){
	return {
		type: PUBLISHER_PACKAGE_SELECTED,
		id
	}
}

function updateAppName(name){
	return {
		type: PUBLISHER_APP_NAME_CHANGED,
		name
	}
} 

function updateAppDescription(description){
	return {
		type: PUBLISHER_APP_DESCRIPTION_CHANGED,
		description
	}
}

function updateAppTags(tags){
	return {
		type: PUBLISHER_APP_TAGS_CHANGED,
		tags
	}
}

function updatePackagePurpose(purpose){
	return {
		type: PUBLISHER_PACKAGE_PURPOSE_CHANGED,
		purpose,
	}
}

function installSelected(install){
	return {
		type: PUBLISHER_PACKAGE_INSTALL_CHANGED,
		install
	}
}

function updatePackageBenefits(benefits){
	return {
		type: PUBLISHER_PACKAGE_BENEFITS_CHANGED,
		benefits
	}
}

function toggleGrid(pkga, pkgb){
	
	return {
		type: PUBLISHER_TOGGLE_GRID,
		pkga,
		pkgb,
	}
}

function toggleVisible(){
	return {
		type: PUBLISHER_TOGGLE_VISIBLE,
	}
}


function submissionSuccess(data){
	return {
		type: PUBLISHER_PUBLISHED_APP,
		data
	}
}


function receivedManifest(manifest){
	return {
    	type: RECEIVE_MANIFEST,
    	manifest,
  	}
}

function initEditor(id){
	return {
		type: EDITOR_INIT,
		id,
	}
}

function tabSelect(tab){
	return {
		type: TAB_SELECT,
		tab,
	}
}

function tabAdd(tab){
	return {
		type: TAB_ADD,
		tab,
	}
}

function tabUpdate(id,label){
	return {
		type: TAB_UPDATE,
		id,
		label,
	}
}

function tabsLoad(tabs){
	return {
		type: TABS_LOAD,
		tabs,
	}
}
	  	

function submit(){

	return function (dispatch, getState) {
		
		const nodesById =getState().nodes.nodesById;
		const nodes = Object.keys(nodesById).map(k=>nodesById[k]);
		const ports = getState().ports.linksById;

		const jsonnodes = nodes.map((node)=>{
			return Object.assign({}, convertNode(node, Object.keys(ports).map((k)=>ports[k])));
		});
		
		const tabs = getState().workspace.tabs;
	
		const flows = [
  					...tabs,
  					...jsonnodes
  		]
  		
  		const app = getState().publisher.app;
  		
  		const packages = getState().publisher.packages.map((pkg)=>{ //add in datastores (outputs)
  			return Object.assign({}, pkg, {datastores: nodes.filter((node)=>{
  				return (node.z === pkg.id) && (node._def.category === "datastores" || (node._def.category === "outputs" && (node.type != "app" && node.type != "debugger")))
      		}).map((node)=>{
      			return {
      				id: node.id,
					name: node.name || node.type,
					type: node.subtype || node.type, 
				}
      		})})
  		});
  		
  		const repo = getState().repos.loaded;
  		
  		const data = {
  		    
  		    repo : repo,
  		    
  		    flows: flows,
  		    
  		  	manifest: {
  				app: Object.assign({}, getState().publisher.app),
  				packages,
  				'allowed-combinations': getState().publisher.grid,
  			}
  		};
  		
  		dispatch(networkActions.networkAccess(`publishing app ${name}`));
  		
  		console.log("PUBLISHING");
  		console.log(data);

		request
  			.post(`${config.root}/github/publish`)
  			.send(data)
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(networkActions.networkError(err.message));
  				}else{
  					dispatch(networkActions.networkSuccess('successfully published app!'));
          			//dispatch(submissionSuccess(res.body));
  	 				dispatch(repoActions.receivedSHA(res.body.repo, res.body.sha));
  	 				dispatch(repoActions.requestRepos());
  	 			}
  	 		});	
		
		 	
		
	}
}

function cancel(){
	return {
		type: PUBLISHER_CANCEL
	}
}

const publisher  = (state) => state[NAME];

const currentpackage = (state)=>{
	const pindex = state[NAME].packages.map(p=>p.id).indexOf(state[NAME].currentpkg);
	return state[NAME].packages[pindex];
}

const datastores = (state) => {

	const nodes = Object.keys(state[NODENAME].nodesById).map(key=>state[NODENAME].nodesById[key]);

	return nodes.filter((node)=>{
      	return (node.z === state[NAME].currentpkg) && (node._def.category === "datastores" || (node._def.category === "outputs" && (node.type != "app" && node.type != "debugger")));
	}).map((node)=>{
		return {
			id: node.id,
			name: node.name || node.type,
			type: node.subtype || node.type, 
			color: node._def.color, 
			icon: node._def.icon,
		}
	});
}

export const selector = createStructuredSelector({
	publisher,
	datastores,
	pkg:currentpackage,
});

export const actionCreators = {
  packageSelected,
  updateAppName,
  updateAppDescription,
  updateAppTags,
  updatePackagePurpose,
  installSelected,
  updatePackageBenefits,
  toggleGrid,
  submissionSuccess,
  receivedManifest,
  toggleVisible,
  submit,
  cancel,

  initEditor,
  tabSelect,
  tabAdd,
  tabUpdate,
  tabsLoad,
}