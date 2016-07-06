import * as ActionTypes from '../constants/ActionTypes';

const pkg = (state = {id:"", name:"", purpose:"", install:"optional", datastores:[], outputs:[], risk:"", benefits:"", }, action)=>{
	switch (action.type) {
		
		case ActionTypes.TAB_UPDATE:
			if (state.id === action.id)
				return  Object.assign({}, state, {name:action.label});
			return state;
		
		case ActionTypes.TAB_ADD:
			return Object.assign({}, state, {name:action.tab.label, id:action.tab.id}); //initialise the state properly if it doesn't exist!
		
		
		//and node removed??
		
		
		case ActionTypes.NODE_DROPPED:
				
				if (action.node._def.category === "datastores"){
					//if (state.datastores.map((d)=>d.type).indexOf(action.node.type) < 0){
						return Object.assign({}, state, {datastores: [...state.datastores, {
																								id: action.node.id,
																								type: action.node.type, 
																								color: action.node._def.color, 
																								icon: action.node._def.icon,												
												}]})
					//}
				} 
			
				if (action.node._def.category === "outputs"){
					//if (state.outputs.map((d)=>d.type).indexOf(action.node.type) < 0){
						return Object.assign({}, state, {outputs: [...state.outputs, {
																								id: action.node.id,
																								type: action.node.type, 
																								color: action.node._def.color, 
																								icon: action.node._def.icon,												
												}]})
					//}
				} 
			
			return state;
			
		case ActionTypes.PUBLISHER_PACKAGE_PURPOSE_CHANGED:
			return Object.assign({}, state, {purpose:action.purpose});
		
			
		case ActionTypes.PUBLISHER_PACKAGE_INSTALL_CHANGED:
			return Object.assign({}, state, {install:action.install});
		
			
		case ActionTypes.PUBLISHER_PACKAGE_BENEFITS_CHANGED:
			return Object.assign({}, state, {benefits:action.benefits});
			
	}
}

const application = (state = {name:"", description:"", tags:""},action)=>{
	switch (action.type) {
	
	 case ActionTypes.PUBLISHER_APP_DESCRIPTION_CHANGED:
	 	return Object.assign({}, state, {description:action.description});
	 
	 case ActionTypes.PUBLISHER_APP_NAME_CHANGED:
	 	return Object.assign({}, state, {name:action.name});
	 	
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

export default function publisher(state = {app:{},  currentpkg:0, packages:[], grid:[]}, action) {
  	switch (action.type) {
	  	
		
	  case ActionTypes.TAB_SELECT:
	  	return Object.assign({}, state, {currentpkg: Math.max(0,state.packages.map((p)=>p.id).indexOf(action.tab.id))});
	  
	  case ActionTypes.TAB_ADD: //a new package is created in the workspace when a new tab is created!
	  	return Object.assign({}, state, {
	  										packages: [...state.packages, pkg(undefined, action)],
	  										currentpkg: state.packages.length	
	  									});
	  	
	  case ActionTypes.TAB_UPDATE: 
	  	return Object.assign({}, state, {packages: state.packages.map((p)=>pkg(p,action))}); 
	  
	  case ActionTypes.TABS_LOAD:
	  	 return Object.assign({}, state, {packages: action.tabs.map((t)=>pkg(undefined, {type: ActionTypes.TAB_ADD, tab: t}))});
	  
	  case ActionTypes.RECEIVE_FLOWS:
	  	 return Object.assign({}, state, {packages: state.packages.map((p)=>{
	  	 	return Object.assign({}, p, { 
	  	 									datastores : action.nodes.filter((n) => (n.z===p.id && n._def.category ==="datastores")).map((n)=>{
	  	 											return {
	  	 													id: n.id,
	  	 													type: n.type, 
															color: n._def.color, 
															icon: n._def.icon
													}			
	  	 									}),
	  	 									
	  	 									outputs: action.nodes.filter((n) => (n.z===p.id && n._def.category ==="outputs")).map((n)=>{
	  	 											return {
	  	 												id: n.id,
	  	 												type: n.type, 
														color: n._def.color, 
														icon: n._def.icon,
													}			
	  	 									}),
	  	 								}
	  	 		);
	  	 	})
	  	 });
	  	 
	  	 // action.nodes.map((n)=>pkg(undefined, {type: NODE_DROPPED, node: n}))});	
	  
	  
	  case ActionTypes.PUBLISHER_PACKAGE_SELECTED:
	  	return Object.assign({}, state, {currentpkg: Math.max(0,state.packages.map((p)=>p.id).indexOf(action.id))});
	  
	  case ActionTypes.PUBLISHER_APP_TAGS_CHANGED:
	  case ActionTypes.PUBLISHER_APP_NAME_CHANGED:
	  case ActionTypes.PUBLISHER_APP_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {app: application(state.app, action)});
	 	
		
	  case ActionTypes.DELETE_NODE:
	 	return Object.assign({}, state, {packages: state.packages.map((p)=>{
	 		if (p.id === action.node.z){
	 			return Object.assign({}, p, {
	 											datastores:p.datastores.filter((d)=>{
	 													return d.id !== action.node.id
	 											}), 
	 											outputs:p.outputs.filter((o)=>{
	 													return o.id !== action.node.id
	 											})
	 										});
	 		}
	 		return p;
	 	})})	
	 
	  case ActionTypes.NODE_DROPPED: 
	  case ActionTypes.PUBLISHER_PACKAGE_BENEFITS_CHANGED:
	  case ActionTypes.PUBLISHER_PACKAGE_INSTALL_CHANGED:	
	  case ActionTypes.PUBLISHER_PACKAGE_PURPOSE_CHANGED:
	  	return Object.assign({}, state, {packages: [
	  													...state.packages.slice(0,state.currentpkg), 
	  													pkg(state.packages[state.currentpkg], action),
	  													...state.packages.slice(state.currentpkg+1)]
	  													
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