import {TAB_ADD, TAB_DELETE, TAB_UPDATE, TABS_LOAD, TAB_SELECT} from '../constants/ActionTypes';

const _replaceTab = (tabs, id, label)=>{
	return tabs.map((tab)=>{
		if (tab.id === id){
			tab.label = label;
		}
		return tab;
	});
};

export default function tabs(state = {current:null, tabs:[]}, action) {
  	switch (action.type) {
	  
	  case TAB_SELECT:
	  	return  Object.assign({}, state, {
	  				current:action.tab
	  			});
	  	
	  case TAB_ADD:
	   
	  	return Object.assign({}, state,  {
	  				tabs:	[...state.tabs, action.tab]	,
	  				current: action.tab,
	  			});
	  
	  case TAB_UPDATE:
	  	return Object.assign({}, state, {
	  			tabs: _replaceTab(state.tabs, state.current.id, action.label),
	  			current: Object.assign({}, state.current, {label:action.label}),
	  	});
	  	
	  case TAB_DELETE:
	  	
	  	return Object.assign({}, state, {
	  				tabs: state.tabs.filter((item)=>{return item.id !== action.id}),
	  				current: state.tabs.reduce((acc,tab)=>{
	  					if (tab.id != action.id)
	  						return tab;
	  					return acc;
	  				},{})
	  	});
	
	  	
	  case TABS_LOAD:
	    
	    if (action.tabs.length > 0){
	    	return Object.assign({}, state, {
	  				tabs:action.tabs,
	  				current: action.tabs[0],
	  		});
	    }
	    return state;
	    
	  	
	  default:
	    return state;
	}
}