import { createStructuredSelector } from 'reselect';
import {getID} from 'utils/nodeUtils';
import {actionCreators as nodeActions} from 'features/nodes/actions';
import {actionCreators as portActions} from 'features/ports';
//import {actionCreators as publisherActions} from 'features/publisher';
import {actionConstants as repoConstants} from 'features/repos/constants';

const INIT_APP  = 'iot.red/tabs/INIT_APP';
const TOGGLE_VISIBLE = 'iot.red/tabs/TOGGLE_VISIBLE';

const TAB_ADD  = 'iot.red/tabs/TAB_ADD';
const TAB_DELETE  = 'iot.red/tabs/TAB_DELETE';

const TABS_LOAD  = 'iot.red/tabs/TABS_LOAD';
const TAB_SELECT  = 'iot.red/tabs/TAB_SELECT';
const PACKAGE_PURPOSE_CHANGED  = 'iot.red/tabs/PACKAGE_PURPOSE_CHANGED';
const PACKAGE_INSTALL_CHANGED  = 'iot.red/tabs/PACKAGE_INSTALL_CHANGED';
const PACKAGE_BENEFITS_CHANGED  = 'iot.red/tabs/PACKAGE_BENEFITS_CHANGED';
const PACKAGE_NAME_CHANGED  = 'iot.red/tabs/PACKAGE_NAME_CHANGED';

const APP_NAME_CHANGED = 'iot.red/tabs/APP_NAME_CHANGED';
const APP_DESCRIPTION_CHANGED = 'iot.red/tabs/APP_DESCRIPTION_CHANGED';
const APP_TAGS_CHANGED = 'iot.red/tabs/APP_TAGS_CHANGED';

//foreign actions
const {RECEIVE_MANIFEST}	= repoConstants;
const FOREIGN_CLEAR = 'iot.red/editor/CLEAR';
	  
export const NAME = 'workspace';

const _createNewTab = (id, name)=>{
	return {
		type: "tab",
		id, 
		name,
		risks: "",
		benefits: "",
		purpose: "",
		install: "optional",	
	}
}

const initialTab = _createNewTab(getID(), "new package");

const initialState = {
	publishervisible: false,
	currentId: initialTab.id,
	tabs: [initialTab.id],
	tabsById : {[initialTab.id]: initialTab},
	grid:[], 
	
	app: {
		name: "",
		description: "",
		tags: "",
		id: "",
	}
}

export default function reducer(state = initialState, action) {
  	switch (action.type) {
	  
	  case TOGGLE_VISIBLE:
	  	return Object.assign({}, state, {publishervisible: !state.publishervisible})
	  
	  case INIT_APP:
	  	return Object.assign({}, state, {app: Object.assign({}, state.app, {id:action.id})});

	  case TAB_SELECT:
	  	return  Object.assign({}, state, {
	  				currentId:action.tabId
	  			});
	  	
	  case TAB_ADD:
	  	return Object.assign({}, state,  {
	  				tabs:	[...state.tabs, action.tab.id],
	  				tabsById: Object.assign({}, state.tabsById, {[action.tab.id] : action.tab}),
	  				currentId: action.tab.id,
	  			});
	  
	  	
	  case TAB_DELETE:
	  	
	  	const newtabs = state.tabs.filter((t)=>{return t !== action.id});

	  	
	  	return Object.assign({}, state, {

	  		tabs: newtabs,
	  		
	  		tabsById: Object.keys(state.tabsById).reduce((acc,id)=>{
	  			if (id != action.id){
	  				acc[id] = state.tabsById[id];
	  			}
	  			return acc;
	  		},{}),

	  		currentId: newtabs.length > 0 ? newtabs[0] : null,
	  	});
	
		
	   case TABS_LOAD:
	    
	    if (action.tabs.length > 0){
	    	return Object.assign({}, state, {
	    		
	    		tabs: action.tabs.map(t=>t.id),

	    		tabsById: action.tabs.reduce((acc,t)=>{
	    			acc[t.id] = _createNewTab(t.id, t.label);
	    			return acc;
	    		},{}),

	    		currentId: action.tabs[0].id,

	    	});
	    }
	    return state;
	  
	 case APP_NAME_CHANGED:
		return Object.assign({}, state, {app: Object.assign({}, state.app, {name:action.name})});

	 case APP_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {app: Object.assign({}, state.app, {description:action.description})});

	 case APP_TAGS_CHANGED:
	 	return Object.assign({}, state, {app: Object.assign({}, state.app, {tags:action.tags})});

	 case PACKAGE_NAME_CHANGED:
	  	return Object.assign({}, state, {
	  		tabsById: Object.assign({}, state.tabsById, {[state.currentId] : Object.assign({}, state.tabsById[state.currentId], {name:action.name})}),
	  	});

	  case PACKAGE_PURPOSE_CHANGED:
	  	return Object.assign({}, state, {
	  		tabsById: Object.assign({}, state.tabsById, {[state.currentId] : Object.assign({}, state.tabsById[state.currentId], {purpose:action.purpose})}),
	  	});

	  case PACKAGE_INSTALL_CHANGED:
	  	return Object.assign({}, state, {
	  		tabsById: Object.assign({}, state.tabsById, {[state.currentId] : Object.assign({}, state.tabsById[state.currentId], {install:action.install})}),
	  	});

	  case PACKAGE_BENEFITS_CHANGED:
	  	return Object.assign({}, state, {
	  		tabsById: Object.assign({}, state.tabsById, {[state.currentId] : Object.assign({}, state.tabsById[state.currentId], {benefits:action.benefits})}),
	  	});

	  case RECEIVE_MANIFEST:
	  	 /*const packages = action.manifest.packages.map((pkg)=>{
	  	 	return Object.keys(pkg).reduce((acc, key)=>{
	  	 		if (key != 'datastores'){
	  	 			acc[key] = pkg[key];
	  	 		}
	  	 		return acc;
	  	 	},{})
	  	 });*/

	  	 const tabs = action.manifest.packages.map((p)=>p.id);

	  	 return Object.assign({}, state, 
	  	 									{
	  	 										app: {
	  	 											name: action.manifest.name,
	  	 											description: action.manifest.description, 
	  	 											tags: (action.manifest.tags || []).join(","),
	  	 										}, 
	  	 										grid:action.manifest['allowed-combinations'],
	  	 										tabs: tabs,
	  	 										tabsById: action.manifest.packages.reduce((acc, t)=>{
	  	 											acc[t.id] = t;
	  	 											return acc;
	  	 										},{}),
	  	 										currentId: tabs[0],
	  	 									});
	  
  	  case FOREIGN_CLEAR:
  	  		return initialState;
  	  		/*const tab = _createNewTab(getID(), "new package");
	    	return {
	    				...initialState,
	  					tabs:	[tab.id],
	  					tabsById: {[tab.id] : tab},
	  					currentId: tab.id,
	  				}*/
	  default:
	    return state;
	}
}




function initApp(id){
	return {
		type: INIT_APP,
		id,
	}
}

function addTab(){
	return (dispatch, getState)=>{
		const tab = _createNewTab(getID(), "new package");
		dispatch({
			type: TAB_ADD,
			tab,
		})
		//dispatch(publisherActions.tabAdd(tab));
	} 
}



function selectTab(tabId){
	return (dispatch, getState)=>{
		dispatch({
			type: TAB_SELECT,
			tabId,
		});
		//dispatch(publisherActions.selectTab(tab));
	} 
}

//make sure cannot delete last tab by checking tabs length
function deleteTab(id){
	return function (dispatch, getState) {
		if (getState().workspace.tabs.length > 1){
		
			dispatch({
				type: TAB_DELETE,
				id,
			});
			dispatch(portActions.deleteTab(id));
			dispatch(nodeActions.deleteTab(id));
		}
	} 
}

function receiveTabs(tabs){
	return (dispatch, getState)=>{
		dispatch({
			type: TABS_LOAD,
			tabs,
		});
		//dispatch(publisherActions.tabsLoad(tabs));
	} 
}

function updatePackageName(id, name){
	return (dispatch, getState)=>{
		dispatch({
			type: PACKAGE_NAME_CHANGED,
			id,
			name: name.replace(/\s/g,"-"),
		});
		//dispatch(publisherActions.updateTab(id,label));
	} 
}

function updatePackagePurpose(purpose){
	return {
		type: PACKAGE_PURPOSE_CHANGED,
		purpose,
	}
}

function installSelected(install){
	return {
		type: PACKAGE_INSTALL_CHANGED,
		install
	}
}

function updatePackageBenefits(benefits){
	return {
		type: PACKAGE_BENEFITS_CHANGED,
		benefits
	}
}

function updateAppName(name){
	return {
		type: APP_NAME_CHANGED,
		name: name.replace(/\s/g, "-"),
	}
} 

function updateAppDescription(description){
	return {
		type: APP_DESCRIPTION_CHANGED,
		description
	}
}

function updateAppTags(tags){
	return {
		type: APP_TAGS_CHANGED,
		tags
	}
}

function toggleVisible(){
	return {
		type: TOGGLE_VISIBLE,
	}
}

const workspace = (state) => state[NAME];

const packages  = (state) => {
	return state[NAME].tabs.map(t=>state[NAME].tabsById[t]);
}

const selectedPackage  = (state) => {
	return state[NAME].tabsById[state[NAME].currentId];
}

const datastores = (state)=>{
	const nodes = Object.keys(state.nodes.nodesById).map(key=>state.nodes.nodesById[key]);

	return nodes.filter((node)=>{
      	return (node.z === state[NAME].currentId 
      			&& (node._def.category === "datastores" || (node._def.category === "outputs" && (node.type != "app" && node.type != "debugger"))));
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
  workspace,
  packages,
  datastores,
  selectedPackage,
});

export const actionCreators = {
  initApp,
  addTab,
  selectTab,
  deleteTab,
  receiveTabs,
  updatePackageName,
  updatePackagePurpose,
  installSelected,
  updatePackageBenefits,
  toggleVisible,
  
  updateAppName,
  updateAppDescription,
  updateAppTags,

  cancel: toggleVisible,
};