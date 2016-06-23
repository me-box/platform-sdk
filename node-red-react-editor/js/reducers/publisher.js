import {PUBLISHER_PACKAGE_SELECTED,PUBLISHER_APP_NAME_CHANGED,PUBLISHER_APP_DESCRIPTION_CHANGED,PUBLISHER_APP_TAGS_CHANGED,PUBLISHER_PACKAGE_DESCRIPTION_CHANGED,PUBLISHER_PACKAGE_INSTALL_CHANGED,PUBLISHER_PACKAGE_BENEFITS_CHANGED,PUBLISHER_TOGGLE_GRID } from '../constants/ActionTypes';
import {TAB_ADD, TAB_UPDATE, TAB_SELECT} from '../constants/ActionTypes';
import {NODE_DROPPED} from '../constants/ActionTypes';

const pkg = (state = {id:"", name:"", description:"", install:"optional", datastores:[], outputs:[], risk:"", benefits:"", }, action)=>{
	switch (action.type) {
		
		case TAB_UPDATE:
			if (state.id === action.id)
				return  Object.assign({}, state, {name:action.label});
			return state;
		
		case TAB_ADD:
			return Object.assign({}, state, {name:action.tab.label, id:action.tab.id}); //initialise the state properly if it doesn't exist!
		
		
		case NODE_DROPPED:
			if (action.node._def.category === "datastores"){
				if (state.datastores.map((d)=>d.type).indexOf(action.node.type) < 0){
					return Object.assign({}, state, {datastores: [...state.datastores, {
																							type: action.node.type, 
																							color: action.node._def.color, 
																							icon: action.node._def.icon,												
											}]})
				}
			} 
			
			if (action.node._def.category === "outputs"){
				if (state.outputs.map((d)=>d.type).indexOf(action.node.type) < 0){
					return Object.assign({}, state, {outputs: [...state.outputs, {
																							type: action.node.type, 
																							color: action.node._def.color, 
																							icon: action.node._def.icon,												
											}]})
				}
			} 
			return state;
			
		case PUBLISHER_PACKAGE_DESCRIPTION_CHANGED:
			return Object.assign({}, state, {description:action.description});
		
			
		case PUBLISHER_PACKAGE_INSTALL_CHANGED:
			return Object.assign({}, state, {install:action.install});
		
			
		case PUBLISHER_PACKAGE_BENEFITS_CHANGED:
			return Object.assign({}, state, {benefits:action.benefits});
			
	}
}

const application = (state = {name:"", description:"", tags:""},action)=>{
	switch (action.type) {
	
	 case PUBLISHER_APP_DESCRIPTION_CHANGED:
	 	return Object.assign({}, state, {description:action.description});
	 
	 case PUBLISHER_APP_NAME_CHANGED:
	 	return Object.assign({}, state, {name:action.name});
	 	
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

export default function publisher(state = {app:{},  currentpkg:0, packages:[], grid:[]}, action) {
  	switch (action.type) {
	  
	  case TAB_SELECT:
	  	return Object.assign({}, state, {currentpkg: Math.max(0,state.packages.map((p)=>p.id).indexOf(action.tab.id))});
	  
	  case TAB_ADD: //a new package is created in the workspace when a new tab is created!
	  	return Object.assign({}, state, {
	  										packages: [...state.packages, pkg(undefined, action)],
	  										currentpkg: state.packages.length	
	  									});
	  	
	  case TAB_UPDATE: 
	  	return Object.assign({}, state, {packages: state.packages.map((p)=>pkg(p,action))}); 
	  
	 
	  	
	  case PUBLISHER_PACKAGE_SELECTED:
	  	return Object.assign({}, state, {currentpkg: Math.max(0,state.packages.map((p)=>p.id).indexOf(action.id))});
	  
	  case PUBLISHER_APP_TAGS_CHANGED:
	  case PUBLISHER_APP_NAME_CHANGED:
	  case PUBLISHER_APP_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {app: application(state.app, action)});
	 	
	 
	  case NODE_DROPPED: 
	  case PUBLISHER_PACKAGE_BENEFITS_CHANGED:
	  case PUBLISHER_PACKAGE_INSTALL_CHANGED:	
	  case PUBLISHER_PACKAGE_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {packages: [
	  													...state.packages.slice(0,state.currentpkg), 
	  													pkg(state.packages[state.currentpkg], action),
	  													...state.packages.slice(state.currentpkg+1)]
	  													
	  })  
	  	
	  case PUBLISHER_TOGGLE_GRID:
	  	
	  
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