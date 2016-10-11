import * as ActionTypes from '../constants/ActionTypes';

const pkg = (state = {id:"", name:"", purpose:"", install:"optional", risk:"", benefits:""}, action)=>{
	switch (action.type) {
		
		case ActionTypes.TAB_UPDATE:
			if (state.id === action.id)
				return  Object.assign({}, state, {name:action.label});
			return state;
		
		case ActionTypes.TAB_ADD:
			return Object.assign({}, state, {name:action.tab.label, id:action.tab.id}); //initialise the state properly if it doesn't exist!
		
			
		case ActionTypes.PUBLISHER_PACKAGE_PURPOSE_CHANGED:
			return Object.assign({}, state, {purpose:action.purpose});
		
			
		case ActionTypes.PUBLISHER_PACKAGE_INSTALL_CHANGED:
			return Object.assign({}, state, {install:action.install});
		
			
		case ActionTypes.PUBLISHER_PACKAGE_BENEFITS_CHANGED:
			return Object.assign({}, state, {benefits:action.benefits});
			
	}
}

const application = (state = {id:"", name:"", description:"", tags:""},action)=>{
	switch (action.type) {
	
	 case ActionTypes.EDITOR_INIT:
		return Object.assign({}, state, {id:action.id});
		
	 case ActionTypes.PUBLISHER_APP_DESCRIPTION_CHANGED:
	 	return Object.assign({}, state, {description:action.description});
	 
	 case ActionTypes.PUBLISHER_APP_NAME_CHANGED:
	 	return Object.assign({}, state, {name:_gitify(action.name)});
	 	
	 case ActionTypes.PUBLISHER_APP_TAGS_CHANGED:
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

export default function publisher(state = {app:{},  currentpkg:"", packages:[], grid:[]}, action) {
  	switch (action.type) {
	  	
	  case ActionTypes.EDITOR_INIT:
	  	return Object.assign({}, state, {app: application(state.app, action)});
	  	
	  case ActionTypes.TAB_SELECT:
	  	return Object.assign({}, state, {currentpkg: action.tab.id});//Math.max(0,state.packages.map((p)=>p.id).indexOf(action.tab.id))});
	  
	  case ActionTypes.TAB_ADD: //a new package is created in the workspace when a new tab is created!
	  	return Object.assign({}, state, {
	  										packages: [...state.packages, pkg(undefined, action)],
	  										currentpkg: action.tab.id,//state.packages.length	
	  									});
	  	
	  case ActionTypes.TAB_UPDATE: 
	  	return Object.assign({}, state, {packages: state.packages.map((p)=>pkg(p,action))}); 
	  
	  case ActionTypes.TABS_LOAD:
	  	 return Object.assign({}, state, {packages: action.tabs.map((t)=>pkg(undefined, {type: ActionTypes.TAB_ADD, tab: t}))});
	  
	  case ActionTypes.RECEIVE_MANIFEST:
	  	 const packages = action.manifest.packages.map((pkg)=>{
	  	 	return Object.keys(pkg).reduce((acc, key)=>{
	  	 		if (key != 'datastores'){
	  	 			acc[key] = pkg[key];
	  	 		}
	  	 		return acc;
	  	 	},{})
	  	 });
	  	 return Object.assign({}, state, {app: action.manifest.app, packages: packages, currentpkg:packages[0].id || "", grid:action.manifest['allowed-combinations']});
	  
	  
	  case ActionTypes.PUBLISHER_PACKAGE_SELECTED:
	  	return Object.assign({}, state, {currentpkg: action.id});//Math.max(0,state.packages.map((p)=>p.id).indexOf(action.id))});
	  
	  case ActionTypes.PUBLISHER_APP_TAGS_CHANGED:
	  case ActionTypes.PUBLISHER_APP_NAME_CHANGED:
	  case ActionTypes.PUBLISHER_APP_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {app: application(state.app, action)});
	 	
	 
	  
	  case ActionTypes.PUBLISHER_PACKAGE_BENEFITS_CHANGED:
	  case ActionTypes.PUBLISHER_PACKAGE_INSTALL_CHANGED:	
	  case ActionTypes.PUBLISHER_PACKAGE_PURPOSE_CHANGED:
	  	const pindex = state.packages.map((p)=>p.id).indexOf(state.currentpkg);
	  	
	  	return Object.assign({}, state, {packages: [
	  													...state.packages.slice(0,pindex), 
	  													pkg(state.packages[pindex], action),
	  													...state.packages.slice(pindex+1)]
	  													
	  })  
	  	
	  case ActionTypes.PUBLISHER_TOGGLE_GRID:
	  	
	  
	  	const idx = _indexOf(state.grid, action.pkga, action.pkgb);
	    
	    if (idx == -1){
	    	return  Object.assign({}, state, {grid: [...state.grid, [action.pkga, action.pkgb]]});
	    }else{
	    	return Object.assign({}, state, {grid: [...state.grid.slice(0,idx), ...state.grid.slice(idx+1)]});
	    }
	  
	 
	  default:
	    return state;
	}
}